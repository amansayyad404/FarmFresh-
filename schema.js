
const Joi= require("joi"); //Joi is a popular JavaScript library used for schema validation.
const review = require("./models/review");

module.exports.listingSchema= Joi.object({
    listing : Joi.object({
        title :  Joi.string().required(), // The 'title' field must be a string, and it is required 
        description : Joi.string().required(), // The 'description' field must be a string and is also required.
        location : Joi.string().required(),  // The 'location' field must be a string and is required.
        country  : Joi.string().required(), // The 'country' field must be a string and is required.
        price :Joi.number().required().min(0), // The 'price' field must be a number. It is required and must be at least 0 (minimum value is 0).
        image :Joi.string().allow("",null)// The 'image' field must be a string, but it is optional. 
                                            // It can be an empty string or null (meaning the image field can be left blank or unset).
    }).required() 
});

module.exports.reviewSchema = Joi.object({
    review :Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
})