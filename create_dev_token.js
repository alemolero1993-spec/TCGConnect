const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET || "devsecret";
const payload = { id: "dev", name: "dev" };
const token = jwt.sign(payload, secret, { expiresIn: "30d" });
console.log(token);