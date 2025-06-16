const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://siddharththikekar14:Vd32Jwt3apQ9FtOM@cluster0.ryf1l4d.mongodb.net/authDB?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
