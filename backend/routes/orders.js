const express = require('express');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user_id !== req.userId) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.updateStatus(req.params.id, status, trackingNumber);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
