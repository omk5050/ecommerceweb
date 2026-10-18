import { NextResponse } from 'next/server';
import pool, { initializeDB } from '@/lib/db';

let dbInitialized = false;

export async function GET(request: Request) {
  try {
    if (!dbInitialized) {
      await initializeDB();
      dbInitialized = true;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    const [rows]: any = await pool.query('SELECT * FROM products');
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
