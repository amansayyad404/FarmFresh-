const express =require("express")
const router = express.Router({mergeParams:true});//function used to create a new router object that can handle routes and middleware separately from the main application.
const wrapAsync=require("../utils/wrapAsync.js") //handel async error
const ExpressError=require("../utils/ExpressError.js")
const Review =require("../models/review.js");
const Listing =require("../models/listing.js");
const { validateReview, IsLoggedIn, isReviewOwner } = require("../middleware.js");

const reviewController =require("../controllers/reviews.js");

// ------------------------------- 
//post review route
router.post("/",IsLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//review delete route
router.delete("/:reviewId", IsLoggedIn,isReviewOwner,wrapAsync(reviewController.destroyReview));

module.exports =router;