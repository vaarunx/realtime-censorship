// Imports 
const express = require("express");
const cherio = require('cherio');
const request = require('request');
const fs = require('fs');

// Create a Write Stream 
var WriteStream  = fs.createWriteStream("ImagesLink.txt", "UTF-8");

// const res = require('express/lib/response')
const app = express();
const port = 3000;



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//Extension Route

const extensionRouter = require("./routes/extension")

app.use("/extension", extensionRouter)

