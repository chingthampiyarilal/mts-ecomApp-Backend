const mongoose = require('mongoose');

// Define the schema for the payment model
const paymentSchema = new mongoose.Schema({
  paymentId: { type: String },
  paymentOrderId: { type: String },
  paymentSignature: { type: String },
  orderId: {type:String},
  userId: { type: String },  
  amount: { type: Number },
  description: { type: String },
  selectedDate: { type: String },
  selectedTime: { type: String },
  status: { type: String, default: 'Pending' },
  userDetails: {          
    name: { type: String },
    email: { type: String },
    contact: { type: String }
  }
});

// Create a model based on the schema
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
