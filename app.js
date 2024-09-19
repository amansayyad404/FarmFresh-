if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose =require("mongoose")
const path=require("path");
const methodOverride =require("method-override")//HTML forms only support GET and POST methods, so method-override helps to bypass this limitation 
const ejsMate =require("ejs-mate"); //used for common boilerplate code like footer header
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session"); //manage user sessions
const MongoStore =require("connect-mongo");
const flash=require("connect-flash");//toast msg
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User =require("./models/user.js");

const listingsRouter = require("./routes/listing.js"); //routes
const reviewsRouter =require("./routes/review.js");    //routes
const userRouter =require("./routes/user.js");    //routes
const { error } = require('console');


//const MONGO_URL ="mongodb://127.0.0.1:27017/FarmFresh" //connecting db------------------//
const dbURL =process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB")

}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect( dbURL);
}                                                       //-------------------//



//-------------------//
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));//path for views folder
app.use(express.urlencoded({extended:true}))//is used to parse incoming request bodies that are URL-encoded.
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))) //to use static files from public folder like css,js
//-------------------//

//store session data in MongoDB
const store =MongoStore.create({
    mongoUrl:dbURL,                   // URL to the MongoDB database where session data will be stored
    crypto:{                         // Crypto is used to encrypt/decrypt session data stored in MongoDB
        secret:process.env.SECRET,
    },
    touchAfter: 2* 24*3600,         // Limits how often the session will be updated in the database 
})
store.on("error",()=>{
    console.log("error in MONGO SESSION STORE",error);
})

const sessionOptions ={
    store,
    secret:process.env.SECRET,      // A secret key used to sign the session ID cookie for security.
    resave:false,                    // Prevents the session from being saved back to the session store if it hasn't been modified during the request.
    saveUninitialized:true ,        // Saves a session that is new but not modified (used to track user even without data).
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};




app.use(session(sessionOptions));// Middleware to enable session management in the app.
app.use(flash());

app.use(passport.initialize());//for all req our passport is initialize
app.use(passport.session());//browser should know which user is send req in that session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //when user login then we serialize this info in session
passport.deserializeUser(User.deserializeUser());//when user stop that session we deserialize that info

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currentUser =req.user;
    
    next();
})


app.get("/",(req,res)=>{
    res.render("listings/homepage")
})


app.use("/",userRouter);//routes
app.use("/listings",listingsRouter); //routes
app.use("/listings/:id/reviews",reviewsRouter);//routes




// ---------------------------------------------------
// Handling all undefined routes with app.all(). 
// This will catch any HTTP method (GET, POST, etc.) for undefined routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found ")) // Passing a custom 404 error using the ExpressError class to the next middleware (error handler)
})

app.use((err,req,res,next)=>{       //created a middelware for handling error!
   
    let{ statusCode=500 ,message="Something went wrong" }= err;  // Destructuring 'statusCode' and 'message' from the error object (err)
   res.status(statusCode).render("error.ejs",{message})
  //Sending the error message back to the client
})

// ---------------------------------------------------


app.listen(8080, ()=>{

    console.log("server is listning to port:8080");
})