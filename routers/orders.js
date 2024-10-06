const express = require("express");
const db = require("../db");
const router = express.Router();
router.get("/", (req, res) => {
  const query = `select * from orders`;
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Failed to retrieve employees" });
    }
    res.status(200).json(result);
  });
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const query = `select * from orders where id=?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Failed to retrieve employees" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Order id doesn't exit" });
    }
    res.status(200).json(result);
  });
});
router.post("/", (req, res) => {
  const {
    employeeId,
    supplierId,
    orderStatusId,
    orderDate,
    shippedDate,
    paidDate,
  } = req.body;

  // First, validate if the employee exists
  const employeeQuery = "SELECT * FROM employees WHERE id = ?";
  db.query(employeeQuery, [employeeId], (err, employeeResult) => {
    if (err) {
      return res.status(500).json({ error: "Failed to check employee" });
    }
    if (employeeResult.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Then, validate if the supplier exists
    const supplierQuery = "SELECT * FROM suppliers WHERE id = ?";
    db.query(supplierQuery, [supplierId], (err, supplierResult) => {
      if (err) {
        return res.status(500).json({ error: "Failed to check supplier" });
      }
      if (supplierResult.length === 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // If both employee and supplier are valid, proceed to add the order
      const orderQuery = `INSERT INTO orders (employeeId, supplierId, orderStatusId, orderDate, shippedDate, paidDate) 
                                VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(
        orderQuery,
        [
          employeeId,
          supplierId,
          orderStatusId,
          orderDate,
          shippedDate,
          paidDate,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to add order" });
          }
          res.status(201).json({
            message: "Order added successfully",
            orderId: result.insertId,
          });
        }
      );
    });
  });
});
router.put("/:id", (req, res) => {
  const orderId = req.params.id;
  const {
    employeeId,
    supplierId,
    orderStatusId,
    orderDate,
    shippedDate,
    paidDate,
  } = req.body;
  const employeeQuery = "SELECT * FROM employees WHERE id = ?";
  db.query(employeeQuery, [employeeId], (err, employeeResult) => {
    if (err) {
      return res.status(500).json({ error: "Failed to check employee" });
    }
    if (employeeResult.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Then, validate if the supplier exists
    const supplierQuery = "SELECT * FROM suppliers WHERE id = ?";
    db.query(supplierQuery, [supplierId], (err, supplierResult) => {
      if (err) {
        return res.status(500).json({ error: "Failed to check supplier" });
      }
      if (supplierResult.length === 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // If both employee and supplier are valid, proceed to add the order
      const orderQuery = `Update orders set employeeId=?, supplierId=?, orderStatusId=?, orderDate=?, shippedDate=?, paidDate=? where id=?`;
      db.query(
        orderQuery,
        [
          employeeId,
          supplierId,
          orderStatusId,
          orderDate,
          shippedDate,
          paidDate,
          orderId,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Failed to update order" });
          }
          res.status(201).json({
            message: "Order update successfully",
          });
        }
      );
    });
  });
});

router.delete("/:id", (req, res) => {
  const orderId = req.params.id;
  const checkOrderQuery = "SELECT * FROM orders WHERE id = ?";
  db.query(checkOrderQuery, [orderId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error checking order" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    const deleteOrderDetailsQuery =
      "DELETE FROM orderDetails WHERE orderId = ?";
    db.query(deleteOrderDetailsQuery, [orderId], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to delete related order details" });
      }
      const deleteOrderQuery = "DELETE FROM orders WHERE id = ?";
      db.query(deleteOrderQuery, [orderId], (err, deleteResult) => {
        if (err) {
          return res.status(500).json({ error: "Failed to delete order" });
        }
        res
          .status(200)
          .json({ message: "Order and related details deleted successfully" });
      });
    });
  });
});

module.exports = router;
