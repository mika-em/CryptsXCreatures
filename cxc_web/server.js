const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname)));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(port, () => {
  console.log(`Running at port ${port}`);
});
