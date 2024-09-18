// flow: we are getting data from 'form' which is parsed by backend and send to 'cloud-storage' 
//then it gives us link of that stored img which we will keep in mongodb

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET

})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'FarmFresh_DEV',
      allowerdFormats: ["png","jpg","jpeg"],//img allowed formats
    },
  });

module.exports={
    cloudinary,
    storage
}