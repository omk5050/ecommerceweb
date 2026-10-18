import { NextResponse } from 'next/server';
import pool, { initializeDB } from '@/lib/db';

let dbInitialized = false;

export async function GET() {
  try {
    if (!dbInitialized) {
      await initializeDB();
      dbInitialized = true;
    }

    const [rows]: any = await pool.query(`
      SELECT o.*, 
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'productId', oi.productId, 
              'quantity', oi.quantity, 
              'packSize', oi.packSize
            )
          ), '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.orderId
      GROUP BY o.id
      ORDER BY o.createdAt DESC
    `);

    // In MySQL, JSON_ARRAYAGG might already return an object or array instead of a string in mysql2
    // If it's a string, we parse it, otherwise we just use it directly.
    const formattedOrders = rows.map((order: any) => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
