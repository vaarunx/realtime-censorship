// Imports 
const express = require("express");
var cors = require('cors')



// const res = require('express/lib/response')
const app = express();
app.use(cors())

const port = 8000;



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//Extension Route

const extensionRouter = require("./routes/extension")

app.use("/extension", extensionRouter)

