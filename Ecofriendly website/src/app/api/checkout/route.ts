import { NextResponse } from 'next/server';
import pool, { initializeDB } from '@/lib/db';
import crypto from 'crypto';

let dbInitialized = false;

export async function POST(request: Request) {
  try {
    if (!dbInitialized) {
      await initializeDB();
      dbInitialized = true;
    }

    const body = await request.json();
    const { customerName, customerEmail, address, items, totalAmount } = body;

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `INSERT INTO orders (id, customerName, customerEmail, address, totalAmount, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, customerName, customerEmail, address || "Not provided", totalAmount, 'completed (demo test)']
      );

      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (orderId, productId, quantity, packSize) VALUES (?, ?, ?, ?)`,
          [orderId, item.productId, item.quantity, item.packSize]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    return NextResponse.json({ 
      success: true, 
      orderId, 
      message: 'Order created successfully. (Payment handled via Demo Mode)' 
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
  }
}
