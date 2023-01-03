const express = require("express");
const path = require('path');
const multer  = require('multer')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(express.json());

app.set("view engine","hbs");

mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.DB_LINK}`)
.then(() => console.log("Connected to atlas!!!"))
.catch((err) => console.log(err));

const userSchema = {
  image : String
}

const user = mongoose.model("user",userSchema);
const staticPath = path.join(__dirname,"public");
app.use(express.static(staticPath));

app.get("/",(req,res)=>{
   res.render("index.html");
})

const uploads = path.join(__dirname,"/public/uploads");
const upload = multer({
      storage:multer.diskStorage({
        destination:function(req,file,cb){
          cb(null,uploads)
        },
        filename:function(req,file,cb){
          cb(null,file.originalname)
        }
      })
}).single("avatar")

app.post("/profile",upload,(req,res)=>{
     console.log(req.file.filename);
     let newUser = new user({
      image : req.file.filename
    })
    newUser.save();
     res.send("Done");
})

app.get("/fetch",(req,res)=>{
  user.find({})
  .then((data)=>{
    res.render("fetchdata",{data})
  })
  .catch((err)=>{
    console.log(err);
  })
})

app.listen(5000,()=>{
   console.log("5000");
})
