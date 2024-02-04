const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts=require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getcookies", (req, res) => {
    res.cookie("greetIndia","Namaste");
    res.cookie("origin","India");
    res.cookie("greet", "hello");
    res.cookie("made-in","INDIA",{signed:true});
    res.send ("sent you some cookies!");
    res.send("signed cookie send");
});


app.get ("/verify", (req, res) =>{
   console.log(req.cookies);
   console.log(req.signedCookies);
   res. send ("verified");
});

 
app.get("/greet", (req, res) => {
    let {name ="anonymous"}=req.cookies;
    res.send(`Hi,${name}`);
});


app.get("/", (req, res) =>{
    console.dir(req.cookies);
  res.send("H1, I am root!");
})


app.use("/users",users);
app.use("/posts",posts);


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});

