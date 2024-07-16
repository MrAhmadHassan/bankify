
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json")
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/admin");
const Account = require("../models/account");
const router = express.Router();





module.exports = router;