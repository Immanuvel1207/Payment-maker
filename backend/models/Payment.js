const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  upiId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, success
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);