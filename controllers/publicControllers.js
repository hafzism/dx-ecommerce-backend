import User from "../models/users.js";
import bcrypt from "bcrypt";

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

export { registerfn, loginfn };
