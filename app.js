import express from "express";
import session from "express-session";
import connectDB from "./db/connectDB.js";
import publicRoutes from './routes/publicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/UserRoutes.js'

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT
const DATABASE_URI = process.env.DATABASE_URI
connectDB(DATABASE_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(
  {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }
))


  app.use('/',publicRoutes)
  app.use('/admin',adminRoutes)
  app.use('/',userRoutes)

app.listen(PORT, () => {
  console.log(`server up and listening to ${PORT}`);
});
