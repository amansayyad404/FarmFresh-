const Listing = require("../models/listing");


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
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename}
    await newlisting.save();
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
   let listing = await  Listing.findByIdAndUpdate(id,{...req.body.listing})

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