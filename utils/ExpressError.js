// Define a "custom error class" called 'ExpressError' that extends the built-in 'Error' class.
// This allows for the creation of custom error objects with additional properties like 'statusCode'.
const { model } = require("mongoose");

class ExpressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;

    }
}
module.exports = ExpressError;