const express = require("express");
const config = require("./config/config.json");
const app = express();




let port = config.PORT || 5000;
app.listen(port,()=>{
    console.log("server is up at localhost:" , port);
})

module.exports = app;