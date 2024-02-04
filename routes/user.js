const express = require("express");
const router = express.Router({mergeParams : true});
const User=require("../models/user.js");
// const { route } = require("./listing");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const { saveRedirecrUrl } = require("../middleware.js");

const userController=require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));


router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirecrUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash : true,
    }),
    userController.login
);


// router.get("/signup",userController.renderSignupForm);

// router.post("/signup",wrapAsync(userController.signup));

// router.get("/login",userController.renderLoginForm);


// router.post(
//     "/login",
//     saveRedirecrUrl,
//     passport.authenticate("local",{
//         failureRedirect:"/login",
//         failureFlash : true,
//     }),
//     userController.login
// );


router.get("/logout", userController.logout);

module.exports=router;