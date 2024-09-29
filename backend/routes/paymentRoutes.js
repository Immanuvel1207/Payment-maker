const express = require('express');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create Payment
router.post('/create', async (req, res) => {
  const { name, upiId, amount, creatorId } = req.body;
  try {
    const paymentCode = uuidv4().slice(0, 8);
    const payment = new Payment({ creator: creatorId, name, upiId, amount, paymentCode });
    await payment.save();
    res.status(201).json({ message: 'Payment Created', paymentCode });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Pay Using Code
router.post('/pay', async (req, res) => {
  const { paymentCode, name, rollNumber, amount } = req.body;
  try {
    const payment = await Payment.findOne({ paymentCode });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const razorpayInstance = new Razorpay({
      key_id: 'YOUR_RAZORPAY_KEY_ID',
      key_secret: 'YOUR_RAZORPAY_KEY_SECRET',
    });

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: 'INR',
      receipt: `receipt_${paymentCode}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ orderId: order.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify Payment
router.post('/verify', async (req, res) => {
  const { orderId, paymentId, signature, paymentCode, name, rollNumber } = req.body;

  const hmac = crypto.createHmac('sha256', 'YOUR_RAZORPAY_KEY_SECRET');
  hmac.update(orderId + '|' + paymentId);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === signature) {
    const payment = await Payment.findOne({ paymentCode });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    payment.paidUsers.push({ name, rollNumber, amount: payment.amount, status: 'completed' });
    await payment.save();

    res.json({ message: 'Payment verified and completed' });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});

module.exports = router;
