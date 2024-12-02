// https://dribbble.com/shots/14864303-Inventory-management-Mobile-app-Customer-Part
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/employees", require("./routers/employee"));
app.use("/suppliers", require("./routers/suppliers"));
app.use("/products", require("./routers/products"));
app.use("/orders", require("./routers/orders"));
app.use("/orderDetails", require("./routers/orderDetails"));
app.use("/orderstatus", require("./routers/orderStatus"));
app.use("/api/auth", require("./routers/loginRoute"));
app.use("/api/user", require("./routers/userRoute"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
