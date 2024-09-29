const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');
const stripe = require('stripe')('sk_test_51PrxJrP1wN1WBtstQw6VE3GkgQNljCHs0bjDkq7YOVMVDHoEJIMqGWx8KH77EfH2iR9rCPViexCac7xVoumvfRaq00XLf2M01T');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Payment-maker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/payments', paymentRoutes);

// Stripe payment session creation
app.post('/create-checkout-session', async (req, res) => {
  const { amount, name } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name },
          unit_amount: amount * 100, // amount in paise (smallest currency unit)
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));