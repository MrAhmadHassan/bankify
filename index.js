const express = require("express");
const app = require("./app");
const dotenv = require('dotenv');
const connect = require("./config/db");
const userRoutes = require("./controllers/user");

connect();
// Set up Global configuration access
dotenv.config();
app.use(express.json());
app.use("/api/v1/users",userRoutes);





