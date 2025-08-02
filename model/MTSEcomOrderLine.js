
import mongoose from 'mongoose';



const orderLineSchema = new mongoose.Schema({
    productId: { type: String },
    productName: { type: String },
    productDesc:{type:String},
    orderId:{ type: String},
    quantity: { type: Number },
    price: { type: Number },
    status: { type: String },
    size: { type: String },
    color: { type: String },
    imageUrl: { type: String},
  

    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });

const MTSEcomOrderLine = mongoose.model('mts-ecom-apporderlines', orderLineSchema);
export default MTSEcomOrderLine;
