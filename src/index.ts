import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("UepaPay Integration Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
