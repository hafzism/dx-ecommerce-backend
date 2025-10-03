import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: { type: Number, required: true,min:1 },
},{ timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

//////////////////////////////cart has some problems. need to fix.

export default Cart;
