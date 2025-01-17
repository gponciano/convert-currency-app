const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();


app.use(express.static(path.join(__dirname)));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


app.get("/api-key", (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on http://localhost:3000");
});
