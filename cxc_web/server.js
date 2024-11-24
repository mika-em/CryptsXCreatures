const express = require("express");
const path = require("path");
const app = express();
const port = 5500; 
const host = "127.0.0.1";

app.use(express.static(path.join(__dirname)));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
