import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

app.listen(5000, () => {
  console.log("TheDoctor backend running on port 5000");
});
