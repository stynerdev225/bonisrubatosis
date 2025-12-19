const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create(email, password, name) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, hashedPassword, name]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async updateProfile(userId, data) {
    const result = await pool.query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING id, email, name, phone',
      [data.name, data.phone, userId]
    );
    return result.rows[0];
  }

  static async addAddress(userId, address) {
    const result = await pool.query(
      'INSERT INTO addresses (user_id, street, city, state, zip, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, address.street, address.city, address.state, address.zip, address.country]
    );
    return result.rows[0];
  }

  static async getAddresses(userId) {
    const result = await pool.query('SELECT * FROM addresses WHERE user_id = $1', [userId]);
    return result.rows;
  }
}

module.exports = User;
