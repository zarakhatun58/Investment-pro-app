import dotenv from "dotenv";
import connectDB from './config/db.js';
import startROICron from "./cron/roiCron.js";
import app from "./app.js"

dotenv.config();


connectDB();

startROICron();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});