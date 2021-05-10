import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    return connection;
  } catch (err) {
    console.error("Connection to db failed", err);
  }
};

export default connectMongo;
