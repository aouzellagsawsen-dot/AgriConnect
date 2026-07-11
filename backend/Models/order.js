import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderNumber: { type: String, required: true, unique: true }, 
  buyerName: { type: String, required: true },
  productName: { type: String, required: true }, 
  totalAmount: { type: Number, required: true }, 
  formattedTotal: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['New', 'Preparing', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'New'
  },
  date: { type: String, required: true } 
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);