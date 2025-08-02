import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({
  userId: { type: String },
  orderId: {
    type: String,
    unique: true
  },
  totalAmount: { type: Number },
  customerEmail: { type: String },
  customerPhone: { type: String },
      orderLines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'mts-ecom-apporderlines'  
  }],
  
  status: { type: String, default: 'Pending' },
  
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,

  imageUrl: { type: String, },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const MTSEcomOrder = mongoose.model('mts-ecom-AppOrders', orderSchema);
export default MTSEcomOrder;

