const Listing = require("../models/listing");
const Review = require("../models/review");

//post review route
module.exports.createReview = async(req,res)=>{
    let listing =await Listing.findById(req.params.id);// Find the "listing" by its ID (from the URL parameter ":id")
    let newReview =new Review(req.body.review);// Create a new review from the data provided in the request body 
    newReview.author=req.user._id;
    listing.reviews.push(newReview);// Add the newly created review's reference (its ObjectId) to the 'reviews' array of the listing

    await newReview.save();// Save the new review document in the database
    await listing.save();// Save the updated listing document (with the newly added review reference)
    req.flash("success","New Review Created!")
    res.redirect(`/listings/${listing._id}`)

}

//review delete route
module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId}=req.params;
    // Find the listing by its ID and remove the review reference (ObjectId) from the 'reviews' array
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});// $pull operator removes the reviewId from the 'reviews' array in the listing
    await Review.findByIdAndDelete(reviewId);// Find the review by its ID and delete the review document from the 'Review' collection
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}