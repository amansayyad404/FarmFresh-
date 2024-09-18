const express =require("express")
const router = express.Router();//function used to create a new router object that can handle routes and middleware separately from the main application.
const User= require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js"); //handel async error
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

router.route("/signup") //if req is get then GET will be called and if it is on post then POST will be called
      .get(userController.renderSignUpForm) //renderSignupForm
      .post(wrapAsync(userController.signUp));  //signup 


router.route("/login")
      .get(userController.renderLoginForm) //renderLoginForm 
      .post(saveRedirectUrl,                // login 
                            //"local": Indicates you're using the local authentication strategy (username & password).
        passport.authenticate( "local", {failureRedirect:'/login' ,failureFlash:true} ),
        userController.login)

//logout 
router.get("/logout",userController.logout)

module.exports =router;