// Exporting a wrapper function that helps handle errors in async route handlers
module.exports =(fn)=>{

    return (req,res,next)=>{
        fn(req,res,next).catch(next);// It calls the original async function (fn) and uses .catch() to pass any errors to next()
    };
};