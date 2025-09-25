import express from "express";
import session from "express-session";
import connectDB from "./db/connectDB.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import MongoStore from "connect-mongo";
import path from 'path';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;
connectDB(DATABASE_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static(path.join(process.cwd(),"uploads")))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DATABASE_URI,
      collectionName:"sessions",
    })
  })
);


app.use("/", publicRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`server up and listening to ${PORT}`);
});
