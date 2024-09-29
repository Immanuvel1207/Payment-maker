const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Create a new payment
router.post('/create', async (req, res) => {
  const { name, upiId, amount } = req.body;

  // Generate an 8-character payment code
  const paymentCode = Math.random().toString(36).substr(2, 8).toUpperCase();

  try {
    const payment = new Payment({ name, upiId, amount, paymentCode });
    await payment.save();
    res.json({ message: 'Payment created', paymentCode });
  } catch (error) {
    res.status(500).json({ error: 'Error creating payment' });
  }
});

// Get payment details by code
router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const payment = await Payment.findOne({ paymentCode: code });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment' });
  }
});

module.exports = router;