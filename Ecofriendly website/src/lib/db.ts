import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'earthform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initializeDB() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INT NOT NULL,
        image VARCHAR(255) NOT NULL,
        dimensions VARCHAR(255),
        capacity VARCHAR(255),
        material VARCHAR(255),
        compostability VARCHAR(255)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customerName VARCHAR(255) NOT NULL,
        customerEmail VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        totalAmount INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId VARCHAR(255) NOT NULL,
        productId VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        packSize VARCHAR(50) NOT NULL,
        FOREIGN KEY(orderId) REFERENCES orders(id)
      )
    `);

    const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      const seedProducts = [
        ["premium-classic-plate-9", 'Premium Classic Plate 9"', "Our 9-inch premium bagasse plate offers the perfect balance of elegance and durability.", 450, "/images/plates.jpg", '9" diameter x 0.6" depth', "Standard meal portion", "100% Sugarcane Bagasse", "Compostable in commercial facilities"],
        ["deep-salad-bowl-500ml", "Deep Salad Bowl 500ml", "Elegant, deep bowls perfectly sized for salads, soups, or pasta dishes.", 550, "/images/bowls.jpg", '6.5" diameter x 2.5" depth', "500ml", "100% Sugarcane Bagasse", "Compostable in commercial facilities"],
        ["clamshell-container-3-comp", "Clamshell Container 3-Comp", "Secure, heavy-duty 3-compartment containers for takeaways and deliveries.", 750, "/images/containers.jpg", '8" x 8" x 3"', "3 compartments", "100% Sugarcane Bagasse", "Compostable in commercial facilities"],
        ["everyday-cup-250ml", "Everyday Cup 250ml", "Sturdy cups suitable for both hot and cold beverages.", 350, "/images/cups.jpg", '3.5" height x 3" diameter', "250ml", "100% Sugarcane Bagasse", "Compostable in commercial facilities"]
      ];

      for (const p of seedProducts) {
        await connection.query(
          `INSERT INTO products (id, name, description, price, image, dimensions, capacity, material, compostability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          p
        );
      }
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    connection.release();
  }
}

export default pool;
