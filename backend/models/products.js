import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
  category: { type: String, required: true },
  qty: { type: String, required: true }, 
  price: { type: String, required: true }, 
  date: { type: String, required: true }, 
  image: { type: String, default: "default-image-url.jpg" }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
