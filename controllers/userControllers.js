import Cart from "../models/carts.js";

///cart fns//////////////////////
export async function getCart(req, res) {
  try {
    const user_id = req.session.userId;
    const carts = await Cart.find({ user_id }).populate("product_id");
    res.status(200).json({ result: carts });
  } catch (error) {
    res.status(403).json({ error: "some errorh hapedned" });
  }
}

export async function postCart(req, res) {
  try {
    const { product_id, quantity } = req.body;
    const qty = Number(quantity);
    const userId = req.session.userId;
    console.log(userId);

    if (!product_id || !qty) {
      return res.status(400).json({ error: "product or qty reqquired" });
    }
    const ifCartItem = await Cart.findOne({ product_id, user_id: userId });
    if (ifCartItem) {
      ifCartItem.quantity += qty;
      await ifCartItem.save();
      return res.status(200).json({ message: "cart item updated" });
    }
    const create = await Cart.create({
      product_id,
      user_id: userId,
      quantity: qty,
    });
    return res
      .status(200)
      .json({ message: "added to cart successfully", create });
  } catch (error) {
    res.status(403).json({ error: "some errorh hapedned" });
    console.log(error); 
  }
}

export async function putCart(req, res) {
  try {
    const cart_id = req.params.id;
    const cart = await Cart.findById(cart_id);
    cart.quantity++;
    await cart.save();
          return res.status(200).json({ message: "cart item updated" });
  } catch (error) {
    res.status(403).json({ error: "some errorh hapedned" });
  }
}

export async function deleteCart(req, res) {
try {
    const cart_id = req.params.id
    const deleted = await Cart.findByIdAndDelete(cart_id)
    return res.status(200).json({ message: "cart item deleted,item is",deleted });
} catch (error) {
     res.status(403).json({ error: "some errorh hapedned" });
 
}
}
