require("dotenv").config();

const express = require("express");

const app = express();

const adminRoutes = require("./routes/admin");

app.use(express.json());
app.use(adminRoutes);
app.listen(process.env.PORT);
