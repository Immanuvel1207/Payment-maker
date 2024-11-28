const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  upiId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentCode: { type: String, unique: true, required: true },
  paidUsers: [
    {
      name: String,
      rollNumber: String,
      amount: Number,
      status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
      time: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;

