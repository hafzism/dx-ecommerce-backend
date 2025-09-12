import mongoose, { Types } from "mongoose";
const orderSchema = new mongoose.Schema({
  user_id: { reqired: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      quantity: { type: Number, required: true },
      price: { type: Number, required: true }

    },
  ], //how?,
  total_price: { required: true, type: Number },
  status: { type: String, default: "pending" },
  //timestamps
},{ timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
