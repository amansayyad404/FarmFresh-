const mongoose =require("mongoose");
const Schema =mongoose.Schema;
const Review =require("./review.js");

const listingSchema =new Schema({

    title:{
        type: String,
        require:true,
    },
    description:{
        type: String,
    },
    image:{
        url:String,
        filename:String,
    
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type : Schema.ObjectId, // Each review is referenced by its unique ObjectId from the 'Review' collection
            ref : "Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    phone: {
        type: String,
        required: true
    },
    availableFor: { // New field to store availability in days
        type: Number, 
        required: true 
    }, 
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

//when we delete any listing then all reviews associted with that review should be deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       
        // listing.reviews contains an array of "review IDs"
        // The $in operator selects all reviews where the _id is in the listing.reviews array
        await Review.deleteMany({_id :{$in :listing.reviews}});
    }
})
// ----------------------------------------------------------------

const Listing =mongoose.model("Listing",listingSchema);
module.exports =Listing;