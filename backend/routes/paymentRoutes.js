const express = require('express');
const Payment = require('../models/Payment');
const User = require('../models/User');
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

// Pay Using Code (Dummy Payment)
router.post('/pay', async (req, res) => {
  const { paymentCode, name, rollNumber } = req.body;
  try {
    console.log('Received payment request:', { paymentCode, name, rollNumber });

    const payment = await Payment.findOne({ paymentCode });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    console.log('Payment found:', payment);

    const user = await User.findOne({ rollNumber });
    console.log('User search result:', user);

    if (!user) return res.status(404).json({ error: `User not found with roll number: ${rollNumber}` });

    // Check if user has already paid
    const existingPayment = payment.paidUsers.find(p => p.rollNumber === rollNumber);
    if (existingPayment) return res.status(400).json({ error: 'You have already paid for this payment' });

    // Add user to paidUsers
    payment.paidUsers.push({
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

    res.json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get Payment Details
router.get('/details/:paymentCode', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentCode: req.params.paymentCode });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//Get payment history
router.get('/mypayments', async (req, res) => {
  try {
    console.log('Fetching payments for user:', req.user.id);
    const user = await User.findById(req.user.id).populate('paymentsMade');
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User payments:', user.paymentsMade);
    res.json(user.paymentsMade);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

module.exports = router;