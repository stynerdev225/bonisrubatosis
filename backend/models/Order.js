const pool = require('../config/database');

class Order {
  static async create(userId, orderData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const orderResult = await client.query(
        'INSERT INTO orders (user_id, total, status, shipping_address) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, orderData.total, 'processing', JSON.stringify(orderData.shippingAddress)]
      );
      const order = orderResult.rows[0];

      for (const item of orderData.items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [order.id, item.productId, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');
      return order;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async findById(orderId) {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1
       GROUP BY o.id`,
      [orderId]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async updateStatus(orderId, status, trackingNumber = null) {
    const result = await pool.query(
      'UPDATE orders SET status = $1, tracking_number = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [status, trackingNumber, orderId]
    );
    return result.rows[0];
  }
}

module.exports = Order;
