import mongoose from "mongoose";

async function connectDB(DATABASE_URI) {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log('database connected');
    
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;