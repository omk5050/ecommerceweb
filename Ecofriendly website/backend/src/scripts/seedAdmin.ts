/**
 * seedAdmin.ts
 *
 * Creates the initial admin account from environment variables.
 * Run via: npm run seed:admin (from the backend directory)
 *
 * SECURITY:
 * - Never prints the password.
 * - Never overwrites an existing admin with the same email.
 * - Reads credentials from env only (ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD).
 */

import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (dnsErr) {
  console.warn('[seed:admin] DNS optimization warning:', dnsErr);
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

const BCRYPT_ROUNDS = 12;

async function seedAdmin(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  const seedName = process.env.ADMIN_SEED_NAME?.trim();
  const seedEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;

  // Validate required env vars
  if (!mongoUri) {
    console.error('[seed:admin] ERROR: MONGODB_URI is not set in .env');
    process.exit(1);
  }
  if (!seedName) {
    console.error('[seed:admin] ERROR: ADMIN_SEED_NAME is not set in .env');
    process.exit(1);
  }
  if (!seedEmail) {
    console.error('[seed:admin] ERROR: ADMIN_SEED_EMAIL is not set in .env');
    process.exit(1);
  }
  if (!seedPassword || seedPassword.length < 8) {
    console.error('[seed:admin] ERROR: ADMIN_SEED_PASSWORD must be set and at least 8 characters.');
    process.exit(1);
  }

  try {
    console.log('[seed:admin] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('[seed:admin] Connected.');

    // Check if admin already exists
    const existing = await Admin.findOne({ email: seedEmail });
    if (existing) {
      console.log(`[seed:admin] Admin with email "${seedEmail}" already exists. Skipping creation.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    console.log('[seed:admin] Hashing password...');
    const passwordHash = await bcrypt.hash(seedPassword, BCRYPT_ROUNDS);

    // Create admin
    const admin = await Admin.create({
      name: seedName,
      email: seedEmail,
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    console.log(`[seed:admin] Admin created successfully.`);
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role:  ${admin.role}`);
    console.log(`  ID:    ${admin._id}`);
    // Password is intentionally NOT printed.

    await mongoose.disconnect();
    console.log('[seed:admin] Done. Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[seed:admin] Fatal error:', error instanceof Error ? error.message : error);
    try { await mongoose.disconnect(); } catch { /* ignore */ }
    process.exit(1);
  }
}

seedAdmin();
