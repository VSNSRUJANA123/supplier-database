// https://dribbble.com/shots/14864303-Inventory-management-Mobile-app-Customer-Part
const express = require("express");
const app = express();
const mysql = require("mysql2");
const dotenv = require("dotenv");
const employeesRoutes = require("./routers/employee");
const suppliersRoutes = require("./routers/suppliers");
const productRoute = require("./routers/products");
const orders = require("./routers/orders");
const orderDetails = require("./routers/orderDetails");
const orderstatus = require("./routers/orderStatus");
dotenv.config();
const cors = require("cors");
app.use(express.json());

app.use("/employees", employeesRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/products", productRoute);
app.use("/orders", orders);
app.use("/orderDetails", orderDetails);
app.use("/orderstatus", orderstatus);
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
