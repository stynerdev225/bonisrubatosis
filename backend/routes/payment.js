const express = require('express');
const stripe = require('../config/stripe');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, items, shippingAddress } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        userId: req.userId,
        items: JSON.stringify(items)
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, items, shippingAddress, total } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const order = await Order.create(req.userId, {
        items,
        shippingAddress,
        total,
        paymentIntentId
      });

      res.json({ order });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

module.exports = router;
