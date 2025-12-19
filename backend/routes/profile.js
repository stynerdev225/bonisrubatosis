const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.updateProfile(req.userId, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/addresses', authenticateToken, async (req, res) => {
  try {
    const address = await User.addAddress(req.userId, req.body);
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/addresses', authenticateToken, async (req, res) => {
  try {
    const addresses = await User.getAddresses(req.userId);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
