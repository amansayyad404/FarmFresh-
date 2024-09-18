const Listing = require("../models/listing");

const maxTimeout = 2147483647; // Maximum allowed timeout in milliseconds (~24.85 days)

//index route
module.exports.index = async (req,res)=>{
    const allListing =await Listing.find({}); //we are getting all data and sending it in allListing 
    res.render("listings/index.ejs", {allListing});
}

//new route
module.exports.renderNewForm = (req,res)=>{ //we have passed IsLoggedIn middleware to check user is logged in to create new listing
 
    res.render("listings/new.ejs");
}

//show route
module.exports.showListing = async (req,res)=>{ 
    let {id}= req.params;
   const listing=await Listing.findById(id).populate({path:"reviews",populate:{path: "author"}}).populate("owner");
                                                                
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
   res.render("listings/show.ejs", {listing});
}

//create route
module.exports.createListing = async (req,res,next) =>{
    let { availableFor } = req.body.listing; // Time in days
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename}
    await newlisting.save();
    
    // Convert the time to milliseconds and set a timeout to delete the listing after that time
   const deleteAfter = availableFor * 24 * 60 * 60 * 1000; // convert days to milliseconds
   

       // Function to handle the deletion with split intervals if needed
       const scheduleDelete = (listingId, remainingTime = deleteAfter) => {
        if (remainingTime > maxTimeout) {
            // Schedule for maxTimeout and call recursively
            setTimeout(() => {
                console.log(`Still waiting to delete listing ${listingId}...`);
                scheduleDelete(listingId, remainingTime - maxTimeout);
            }, maxTimeout);
        } else {
            // Schedule the actual delete when remaining time is less than maxTimeout
            setTimeout(async () => {
                await Listing.findByIdAndDelete(listingId);
                console.log(`Listing ${listingId} deleted after ${availableFor} days.`);
            }, remainingTime);
        }
    };
    //problem while using may days to wait
// If the Time is Too Long:
       // The function checks if the time left to wait (remainingTime) is longer than the maximum allowed time for setTimeout (maxTimeout).
// Split the Time:
      // If it's too long, the function uses setTimeout to wait for maxTimeout milliseconds (the maximum time setTimeout can handle).
      // After this time, it prints a message saying that the listing is still waiting to be deleted.
// Repeat:
    // The function then calls itself (recursively) with the updated time (remainingTime reduced by maxTimeout).
    // This process repeats until the remaining time is less than or equal to maxTimeout.
    // In essence, it breaks the long wait time into chunks that setTimeout can handle and keeps checking until it's time to delete the listing.

        // Schedule the delete operation
        scheduleDelete(newlisting._id);

    req.flash("success","New Listing Created!")
    res.redirect("/listings");

}

//edit route
module.exports.renderEditForm =async(req,res)=>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
    }

//update route
module.exports.updateListing =async(req,res)=>{

    let {id} = req.params;

    
   let listing = await  Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file !== "undefined"){ //if img is updated then only update img
   let url = req.file.path; //after updating listing we will update img
   let filename = req.file.filename;
   listing.image = {url,filename}
   await listing.save();
   }

    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)
    }

//delete route
module.exports.destroyListing =async(req,res)=>{
    let {id}= req.params;
    let deleteListing =await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted!")
    res.redirect("/listings")
    
    }