import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "gjqr4z7l";
const apiKey = process.env.CLOUDINARY_API_KEY || "661853547593283";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "ZdOCNDztf7kd-TrN7e_4LwsLEbc";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };
