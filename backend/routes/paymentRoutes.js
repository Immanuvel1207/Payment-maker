const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Payment
router.post('/create', async (req, res) => {
  const { name, upiId, amount } = req.body;
  try {
    const paymentCode = uuidv4().slice(0, 8);
    const payment = new Payment({ 
      creator: req.user.id,
      name, 
      upiId, 
      amount, 
      paymentCode 
    });
    await payment.save();

    res.status(201).json({ 
      message: 'Payment Created', 
      paymentCode,
      upiId,
      amount
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(400).json({ error: error.message });
  }
});

// Pay Using Code
router.post('/pay', async (req, res) => {
  const { paymentCode } = req.body;
  try {
    const payment = await Payment.findOne({ paymentCode });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user has already paid
    const existingPayment = payment.paidUsers.find(p => p.userId.toString() === req.user.id);
    if (existingPayment) return res.status(400).json({ error: 'You have already paid for this payment' });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: payment.amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: paymentCode,
    });

    res.json({ 
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: payment.amount * 100,
      upiId: payment.upiId,
      paymentCode
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Verify Payment
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentCode } = req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    try {
      const payment = await Payment.findOne({ paymentCode });
      if (!payment) return res.status(404).json({ error: 'Payment not found' });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Add user to paidUsers
      payment.paidUsers.push({
        userId: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        amount: payment.amount,
        status: 'completed',
        time: Date.now()
      });

      // Add payment to user's paymentsMade
      user.paymentsMade.push(payment._id);

      await payment.save();
      await user.save();

      return res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
      console.error('Error updating payment:', error);
      return res.status(500).json({ error: 'Error updating payment: ' + error.message });
    }
  } else {
    return res.status(400).json({ message: "Invalid signature sent!" });
  }
});

// Get Payment Details
router.get('/details/:paymentCode', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentCode: req.params.paymentCode });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    
    // Remove the authorization check so any user can fetch the payment details
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get payment history
router.get('/mypayments', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('paymentsMade');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.paymentsMade);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get payments created by the user
router.get('/created', async (req, res) => {
  try {
    const payments = await Payment.find({ creator: req.user.id });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching created payments:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

module.exports = router;

