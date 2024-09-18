const User= require("../models/user.js");

//renderSignup
module.exports.renderSignUpForm = (req,res)=>{
    res.render("user/signup.ejs");
}

//signup 
module.exports.signUp = async(req,res)=>{
    try {
    let {username,email,password} =req.body;
     const newUser=new User({email,username});
     const registeredUser = await User.register(newUser,password); // Use passport-local-mongoose's 'register' method to register the user
                                                                     // This automatically hashes the password and saves the user in the database
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to FarmFresh!")
            res.redirect("/listings");
    })

    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup")
    }
     

} ;

//renderLoginForm 
module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
}

// login 
module.exports.login = async(req,res)=>{
    req.flash("success","welcome back");
    console.log(req.user);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout 
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return   next(err);
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings");
    })
}