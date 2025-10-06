import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String },               
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },               
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        product_id: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        item_total: { type: Number, required: true },
      },
    ],
    total_price: { required: true, type: Number },
    status: { type: String, default: "pending" },
    address: { type: addressSchema, required: true }, // <-- new
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
