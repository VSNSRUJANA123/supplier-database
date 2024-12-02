const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const dbConnection = require("../config/db");

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(403).send("required username and password");
  }
  const sqlQuery = "select * from user where username=?";
  dbConnection.query(sqlQuery, [username], async (err, result) => {
    if (err) {
      return res.status(403).send("error to retrieve");
    }
    if (result.length > 0) {
      return res.status(403).send("user already exist");
    }
    const sqlQuery = "insert into user(username,password) values(?,?)";
    const hashPassowrd = await bcrypt.hash(password, 10);
    dbConnection.query(sqlQuery, [username, hashPassowrd], (err, result) => {
      if (err) {
        return res.status(403).send("error to create");
      }
      if (result.affectedRows === 0)
        return res.status(403).send("failed to create");
      return res.status(200).json({ message: "user created successfully" });
    });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(403).send("required username and password");
  }
  const sqlQuery = "select * from user where username=?";
  dbConnection.query(sqlQuery, [username], async (err, result) => {
    if (err) return res.status(403).send("error to check user");
    if (result.length > 0) {
      const isPasswordValid = await bcrypt.compare(
        password,
        result[0].password
      );
      if (!isPasswordValid) {
        return res.status(400).send("Invalid password");
      }
      const token = jwt.sign(
        { username: result[0].username, role: result[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.status(200).json({ token, result });
    }
    return res.status(403).send("user doesn't exist create account");
  });
});
router.get("/user", (req, res) => {
  const sqlQuery = "select * from user";
  dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(403).send("err to retrieve");
    }
    return res.status(200).send(result);
  });
});
module.exports = router;
