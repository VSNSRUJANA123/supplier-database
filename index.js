const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Srujana@123",
  database: "suppilerdatabse",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
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
  const { firstname, lastname, email, phonenumber, company_name, address } =
    req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !phonenumber ||
    !company_name ||
    !address
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO contacts (firstname, lastname,email, phonenumber, company_name, address) 
                   VALUES (?, ?, ?, ?, ?,?)`;
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
