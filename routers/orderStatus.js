const express = require("express");
const db = require("../db");
const router = express.Router();
// GET all order statuses
router.get("/", (req, res) => {
  const query = "SELECT * FROM orderStatus";
  db.query(query, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve order statuses" });
    }
    res.status(200).json(result);
  });
});

// GET a specific order status by ID
router.get("/:id", (req, res) => {
  const orderStatusId = req.params.id;
  const query = "SELECT * FROM orderStatus WHERE id = ?";
  db.query(query, [orderStatusId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve order status" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Order status not found" });
    }
    res.status(200).json(result[0]);
  });
});

// POST to add a new order status
router.post("/", (req, res) => {
  const { status, addedBy, modifiedBy } = req.body;

  if (!status || !addedBy) {
    return res.status(400).json({ error: "Status and addedBy are required" });
  }

  const query = `INSERT INTO orderStatus (status, addedBy, modifiedBy, created_at, updated_at)
                   VALUES (?, ?, ?, NOW(), NOW())`;

  db.query(query, [status, addedBy, modifiedBy], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add order status" });
    }
    res.status(201).json({
      message: "Order status added successfully",
      orderStatusId: result.insertId,
    });
  });
});

// PUT to update an order status
router.put("/:id", (req, res) => {
  const orderStatusId = req.params.id;
  const { status, modifiedBy } = req.body;

  if (!status || !modifiedBy) {
    return res
      .status(400)
      .json({ error: "Status and modifiedBy are required" });
  }

  const query = `UPDATE orderStatus 
                   SET status = ?, modifiedBy = ?, updated_at = NOW() 
                   WHERE id = ?`;

  db.query(query, [status, modifiedBy, orderStatusId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to update order status" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order status not found" });
    }
    res.status(200).json({ message: "Order status updated successfully" });
  });
});

// DELETE an order status by ID
router.delete("/:id", (req, res) => {
  const orderStatusId = req.params.id;
  // Check if the order status exists
  const checkQuery = "SELECT * FROM orderStatus WHERE id = ?";
  db.query(checkQuery, [orderStatusId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error checking order status" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Order status not found" });
    }

    // Proceed to delete the order status
    const deleteQuery = "DELETE FROM orderStatus WHERE id = ?";
    db.query(deleteQuery, [orderStatusId], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete order status" });
      }
      res.status(200).json({ message: "Order status deleted successfully" });
    });
  });
});

module.exports = router;
