const express = require("express");
const db = require("../db");
const router = express.Router();
router.get("/", (req, res) => {
  const query = `select * from products`;
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("Failed to retrieve employees");
    }
    res.status(200).json(result);
  });
});
router.get("/:id", (req, res) => {
  const productsId = req.params.id;
  const query = `select * from products where id=?`;
  db.query(query, [productsId], (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "products not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.post("/", (req, res) => {
  const { code, name, description, price, addedby } = req.body;
  const employeeQuery = "SELECT * FROM employees WHERE id = ?";
  db.query(employeeQuery, [addedby], (err, employeeResult) => {
    if (err) {
      console.error("Error checking employeeId:", err);
      return res.status(500).json({ error: "Failed to verify employeeId" });
    }
    if (employeeResult.length === 0) {
      return res.status(404).json({ error: "Employee ID does not exist" });
    }
    const productQuery = `insert into products (code,name,description,price,addedby) values (?,?,?,?,?)`;
    db.query(
      productQuery,
      [code, name, description, price, addedby],
      (err, result) => {
        if (err) {
          console.error("Error inserted products", err);
        }
        res.status(201).json({
          message: "Products added successfully",
          productsId: result.insertId,
        });
      }
    );
  });
});

router.put("/:id", (req, res) => {
  const productIndex = req.params.id;
  const { code, name, description, price, modifiedBy } = req.body;
  const employeeQuery = "select * from employees where id = ?";
  db.query(employeeQuery, [modifiedBy], (err, employeeQuery) => {
    if (err) {
      // console.log("Error checking employee id", err);
      return res.status(500).json({ message: "Failed to check employee id" });
    }
    if (employeeQuery.length === 0) {
      return res.status(404).json({ message: "Employee id doesn't Exist" });
    }
    const productUpdate = `update products set code=?,name=?, description=?, price=?, modifiedBy=? where id=?`;
    db.query(
      productUpdate,
      [code, name, description, price, modifiedBy, productIndex],
      (err, result) => {
        if (err) {
          return res.status(500).send({ message: "failed to update product" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).send({ message: "product doesn't exist" });
        }
        res.status(200).json({ message: "successfully updated product" });
      }
    );
  });
});
router.delete("/:id", (req, res) => {
  const deleteIndex = req.params.id;
  const deleteQueryId = `delete from products where id=?`;
  db.query(deleteQueryId, [deleteIndex], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "failed to fetch id" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "product not found" });
    }
    res.status(200).json({ message: "deleted successfully" });
  });
});
module.exports = router;
