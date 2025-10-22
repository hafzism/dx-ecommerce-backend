import express from "express";
import session from "express-session";
import connectDB from "./db/connectDB.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import MongoStore from "connect-mongo";
import path from 'path';
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();

const app = express();
app.use(express.json())
app.use(cors({
  origin:[ 'http://dx-ecommerce-frontend.s3-website.ap-south-1.amazonaws.com','http://localhost:5173','https://d3ai0wwxkr3sud.cloudfront.net'],
  credentials: true,               
}));
const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;
connectDB(DATABASE_URI);
app.set('trust proxy', 1);   //must look 
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static(path.join(process.cwd(),"uploads")))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only true in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for production, 'lax' for dev
    },
    store: MongoStore.create({
      mongoUrl: DATABASE_URI,
      collectionName: "sessions",
    })
  })
);

app.use("/", publicRoutes);
app.use("/admin", adminRoutes);
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`server up and listening to ${PORT}`);
});