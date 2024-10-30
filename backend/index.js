const express = require('express');
require('dotenv').config()
const connect=require("./config/db")
const userRoutes=require('./routes/users/userRoutes')
const cors=require('cors')
const path=require('path')
//-----------------server
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//----------------database connection
connect();


//-------testRoutes

app.get('/api', (req, res) => {
  res.json({ message: "Hello from server loveing!" });

});

//Routes

app.use(userRoutes);









//------------------------------server listen
app.listen(process.env.PORT, () => {
  console.log(`Server working ${PORT}`);
});