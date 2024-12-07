const express = require("express");
const db = require("../config/db");
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
  const { code, name, description, price } = req.body;
  const productQuery = `insert into products (code,name,description,price) values (?,?,?,?)`;
  db.query(productQuery, [code, name, description, price], (err, result) => {
    if (err) {
      return res.status(403).send("query error or enter unique id ");
    }
    if (result.affectedRows === 0) {
      return res.status(403).send("must add unique id");
    }
    res.status(201).json({ message: "Products added successfully" });
  });
});

router.put("/:id", (req, res) => {
  const productIndex = req.params.id;
  const { code, name, description, price } = req.body;
  const productUpdate = `update products set code=?,name=?, description=?, price=? where id=?`;
  db.query(
    productUpdate,
    [code, name, description, price, productIndex],
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
