const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = {
    folder,
    resource_type: "auto",
  };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  try {
    if (file && file.tempFilePath) {
      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, options);
      return result;
    } else {
      throw new Error("File is missing or tempFilePath is not defined.");
    }
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};


// const cloudinary =require("cloudinary").v2;


// exports.uploadImageToCloudinary =  async (file,folder,height,quality) => {
//     const options = {
//         folder,
//         resource_type: "auto",
//     } 
//     if(height)
//     {
//         options.height = height
//     }
//     if(quality)
//     {
//         options.quality = quality;
//     }
//    return await cloudinary.uploader.upload(file.tempFilePath , options);
// }