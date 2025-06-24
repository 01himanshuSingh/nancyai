// lib/uploadCloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (filePath) => {

   try {
    const result = await cloudinary.uploader.upload(filePath);
    unlinkSync(filePath); // delete temp file
    return result.secure_url;
  } catch (error) {
    unlinkSync(filePath);
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadCloudinary;
