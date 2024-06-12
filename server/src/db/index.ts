import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URL || "";

connect(uri)
  .then(() => {
    console.log("DB connected successfully.");
  })
  .catch((err) => {
    console.log("DB connection error: ", err.message);
  });
