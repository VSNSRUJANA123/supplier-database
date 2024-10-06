const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all suppliers
router.get("/", (req, res) => {
  const query = "SELECT * FROM suppliers";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to retrieve suppliers");
    }
    res.status(200).json(result);
  });
});

// Get supplier by ID
router.get("/:id", (req, res) => {
  const supplierId = req.params.id;
  const query = "SELECT * FROM suppliers WHERE id = ?";

  db.query(query, [supplierId], (err, result) => {
    if (err) {
      console.error("Error fetching supplier:", err);
      return res.status(500).json({ error: "Failed to retrieve supplier" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(result[0]);
  });
});

// Add a new supplier (only if the employee ID exists)
router.post("/", (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phonenumber,
    company_name,
    jobtitle,
    address,
    city,
    state,
    zip,
    website,
    description,
    addedBy,
  } = req.body;

  const employeeQuery = "SELECT * FROM employees WHERE id = ?";
  db.query(employeeQuery, [addedBy], (err, employeeResult) => {
    if (err) {
      console.error("Error checking employeeId:", err);
      return res.status(500).json({ error: "Failed to verify employeeId" });
    }
    if (employeeResult.length === 0) {
      return res.status(404).json({ error: "Employee ID does not exist" });
    }
    const supplierQuery = `INSERT INTO suppliers (firstname,
    lastname,
    email,
    phonenumber,
    company_name,
    jobtitle,
    address,
    city,
    state,
    zip,
    website,
    description,
    addedBy)
    VALUES (?, ?, ?, ?, ? , ? , ? , ? , ? , ? , ? , ? ,?)`;
    db.query(
      supplierQuery,
      [
        firstname,
        lastname,
        email,
        phonenumber,
        company_name,
        jobtitle,
        address,
        city,
        state,
        zip,
        website,
        description,
        addedBy,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting supplier data:", err);
          return res.status(500).json({ error: "Failed to add supplier" });
        }
        res.status(201).json({
          message: "Supplier added successfully",
          supplierId: result.insertId,
        });
      }
    );
  });
});

// Update supplier by ID
router.put("/:id", (req, res) => {
  const productIndex = req.params.id;
  const {
    firstname,
    lastname,
    email,
    phonenumber,
    company_name,
    jobtitle,
    address,
    city,
    state,
    zip,
    website,
    description,
    addedBy,
  } = req.body;

  const employeeQuery = "SELECT * FROM employees WHERE id = ?";
  db.query(employeeQuery, [addedBy], (err, employeeResult) => {
    if (err) {
      console.error("Error checking employeeId:", err);
      return res.status(500).json({ error: "Failed to verify employeeId" });
    }

    if (employeeResult.length === 0) {
      return res.status(404).json({ error: "Employee ID does not exist" });
    }
    const query = `UPDATE suppliers SET firstname=?,
    lastname=?,
    email=?,
    phonenumber=?,
    company_name=?,
    jobtitle=?,
    address=?,
    city=?,
    state=?,
    zip=?,
    website=?,
    description=?,
    addedBy=? WHERE id = ?`;

    db.query(
      query,
      [
        firstname,
        lastname,
        email,
        phonenumber,
        company_name,
        jobtitle,
        address,
        city,
        state,
        zip,
        website,
        description,
        addedBy,
        productIndex,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update supplier" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json({ message: "Supplier updated successfully" });
      }
    );
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM suppliers WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send({ error: "Failed to delete supplier" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Supplier not found" });
    }
    res.status(200).json({ message: "Supplier deleted successfully" });
  });
});

module.exports = router;
