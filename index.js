// https://dribbble.com/shots/14864303-Inventory-management-Mobile-app-Customer-Part
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const db = mysql.createPool({
  host: "185.199.52.156",
  user: "inventoryapp",
  database: "inventory",
  password: "iLKodMll10XJhBi1lgTp",
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
  connection.release();
});

app.get("/contacts", (req, res) => {
  const query = "select * from contacts";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("failed to retrieve");
    }
    res.status(200).json(result);
  });
});
app.get("/contacts/:id", (req, res) => {
  const contactId = req.params.id;
  const query = "SELECT * FROM contacts WHERE id = ?";

  db.query(query, [contactId], (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to retrieve contact" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(result[0]);
  });
});
app.post("/add-contact", (req, res) => {
  const {
    id,
    firstname,
    lastname,
    email,
    phonenumber,
    // job_title,
    company_name,
    address,
  } = req.body;

  if (
    (!id,
    !firstname ||
      !lastname ||
      !email ||
      !phonenumber ||
      // !job_title ||
      !company_name ||
      !address)
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO contacts (firstname, lastname,email, phonenumber, company_name, address) 
                   VALUES (?, ?, ?, ?,?, ?)`;
  db.query(
    query,
    [firstname, lastname, email, phonenumber, company_name, address],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Failed to add contact" });
      }
      res.status(201).json({
        message: "Contact added successfully",
        contactId: result.insertId,
      });
    }
  );
});
app.put("/update-contact/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phonenumber, company_name, address } =
    req.body;
  const query = `update contacts set firstname=?,lastname=?,email=?,
    phonenumber=?,    
    company_name=?,
    address=? where id=?`;
  db.query(
    query,
    [firstname, lastname, email, phonenumber, company_name, address, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update column" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.status(200).json({ message: "Item updated Successfully" });
    }
  );
});
app.delete("/delete-contact/:id", (req, res) => {
  const { id } = req.params;
  const query = `delete from contacts where id=? `;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send({ error: "failed to delete" });
    }
    if (result.affectedRows === 0) {
      return res.status(500).send({ error: "data not found" });
    }
    res.status(200).json({ message: "Delete data successfully" });
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
