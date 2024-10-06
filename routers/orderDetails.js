const express = require("express");
const db = require("../db");
const router = express.Router();
router.get("/", (req, res) => {
  const query = "SELECT * FROM orderDetails";
  db.query(query, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve order details" });
    }
    res.status(200).json(result);
  });
});

router.get("/:id", (req, res) => {
  const orderDetailId = req.params.id;
  const query = "SELECT * FROM orderDetails WHERE id = ?";

  db.query(query, [orderDetailId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve order detail" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Order detail not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.post("/", (req, res) => {
  const { orderId, productId, quantity, unitPrice, addedBy } = req.body;

  // Ensure all required fields are provided
  if (!orderId || !productId || !quantity || !unitPrice || !addedBy) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const checkProductQuery = `select * from products where id=?`;
  db.query(checkProductQuery, [productId], (err, productResult) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res
        .status(500)
        .json({ error: "Failed to check product existence" });
    }

    if (productResult.length === 0) {
      // Product ID does not exist
      return res.status(404).json({ error: "Product not found" });
    }

    // If product exists, insert the order detail
    const insertQuery = `
      INSERT INTO orderDetails (orderId, productId, quantity, unitPrice, addedBy) 
      VALUES (?, ?, ?, ?, ?)`;

    db.query(
      insertQuery,
      [orderId, productId, quantity, unitPrice, addedBy],
      (err, result) => {
        if (err) {
          console.error("Error inserting order detail:", err);
          return res.status(500).json({ error: "Failed to add order detail" });
        }
        res.status(201).json({
          message: "Order detail added successfully",
          orderDetailId: result.insertId,
        });
      }
    );
  });
});

router.put("/:id", (req, res) => {
  const orderDetailId = req.params.id;
  const { orderId, productId, quantity, unitPrice, modifiedBy } = req.body;

  // Ensure all required fields are provided
  if (!orderId || !productId || !quantity || !unitPrice || !modifiedBy) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
      UPDATE orderDetails 
      SET orderId = ?, productId = ?, quantity = ?, unitPrice = ?, modifiedBy = ?, updated_at = NOW()
      WHERE id = ?`;

  db.query(
    query,
    [orderId, productId, quantity, unitPrice, modifiedBy, orderDetailId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update order detail" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order detail not found" });
      }
      res.status(200).json({ message: "Order detail updated successfully" });
    }
  );
});

router.delete("/:id", (req, res) => {
  const orderDetailId = req.params.id;

  const query = "DELETE FROM orderDetails WHERE id = ?";

  db.query(query, [orderDetailId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete order detail" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order detail not found" });
    }
    res.status(200).json({ message: "Order detail deleted successfully" });
  });
});

module.exports = router;
