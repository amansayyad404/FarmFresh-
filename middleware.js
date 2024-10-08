const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js")
const { listingSchema ,reviewSchema} =require("./schema.js"); //schema validation using Joi


//login info to use features
module.exports.IsLoggedIn = (req,res,next)=>{

    if (!req.isAuthenticated()){ //if not logged in 
        req.session.redirectUrl = req.originalUrl; //current page url
        req.flash("error","you must be logged!");
        return res.redirect("/login");
    }
    next();
}

//send to page from where req was send
module.exports.saveRedirectUrl = (req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

//if current user and listing owner are not same return 
module.exports.isOwner = async(req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    
    if(!listing.owner._id.equals(res.locals.currentUser._id) ){ 
        req.flash("error","You are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
    
    }
    next();
}

//check schema of listing from incoming req.body
module.exports.validateListing =(req,res,next)=>{ 
    let {error}= listingSchema.validate(req.body)  // This ensures the incoming data matches the schema's structure and rules.
    if(error){
        let errMsg =error.details.map((ele)=>ele.message).join(",");
     throw new ExpressError(400,errMsg);

    }else{
        next();
    }
}

// This ensures the incoming data matches the schema's structure and rules.
module.exports.validateReview =(req,res,next)=>{ 
    let {error}= reviewSchema.validate(req.body)  
    if(error){
        let errMsg =error.details.map((ele)=>ele.message).join(",");
     throw new ExpressError(400,errMsg);

    }else{
        next();
    }
}

//if current user and review owner are not same return 
module.exports.isReviewOwner = async(req,res,next)=>{
    let {id,reviewId}= req.params;
    let review = await Review.findById(reviewId);
    
    if(!review.author.equals(res.locals.currentUser._id) ){ 
        req.flash("error","You are not the author of this Review");
       return res.redirect(`/listings/${id}`);
    
    }
    next();
}