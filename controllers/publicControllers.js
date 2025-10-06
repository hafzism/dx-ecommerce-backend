import User from "../models/users.js";
import Product from "../models/products.js";
import bcrypt from "bcrypt";
import Category from "../models/categories.js";


function checkauth(req,res){
  if(req.session && req.session.userId){
    return res.json({
      isAuthenticated: true,
      role: req.session.role,
      user: req.session.userId,
    });
  } else {
    return res.json({ isAuthenticated: false });
  }
};
async function registerfn(req, res) {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res
        .status(400)
        .json({ error: "Username or email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newuser = await User.create({
      username: username,
      email: email,
      password: hashed,
    });
    res
      .status(200)
      .json({
        message: "new user registered succesfully",
        id: newuser._id,
        name: newuser.username,
      });
  } catch (error) {
    console.log(error);
  }
}

async function loginfn(req, res) {
  try {
    const { uname, pword } = req.body;
    const user = await User.findOne({ username: uname });
    if (!user) {
      return res.status(400).json({ error: "no user found" });
    }
    if(!user.isEnabled){
      return res.status(400).json({ error: "your account is not enabled" });
    }
    const matched = await bcrypt.compare(pword, user.password);
    if (!matched) {
      return res.status(400).json({ error: "wrong password" });
    }
    if (user.role === "admin") {
      return res
        .status(400)
        .json({ error: "you are admin, login through your page." });
    }
    req.session.userId = user._id;
    req.session.role = user.role;
    return res
      .status(200)
      .json({ message: "login successfull", session: req.session.role });
  } catch (error) {
    res.status(500).json({ error: 'serber errror' });
  }
}


async function getProducts(req,res){
try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products)
} catch (error) {
  res.status(500).json({ error: 'serber errror' });
}
}

async function getProductsById(req,res) {
try {
    const id = req.params.id
    const products = await Product.findById(id).populate("category");
        if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(products)  
} catch (error) {
  console.error(error);
    res.status(500).json({ error: 'serber errror' });
}
}

async function getCategories(req,res) {
try {
    const categories = await Category.find()
    res.status(200).json(categories)
} catch (error) {
      res.status(500).json({ error: 'serber errror' });
}
}




async function getCategoriesProducts(req,res) {
try {
  const catid = req.params.id
    const products  = await Product.find({category:catid})
    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this category' });
    }
    res.status(200).json(products)
} catch (error) {
      res.status(500).json({ error: 'serber errror' });
}
}





function logout(req,res) {
  req.session.destroy(()=>{ 
    res.status(200).json({message:'logout successfull'})
  })
}
export { registerfn, loginfn, getProducts,getProductsById,getCategories,logout,checkauth,getCategoriesProducts};