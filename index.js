const connectToMongo = require("./db");
const express = require('express');

connectToMongo();

const app = express()
const port = 3000

app.use(express.json());
//available routes
app.get("/", (req, res)=>{
  res.send("I am your application");
})
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})