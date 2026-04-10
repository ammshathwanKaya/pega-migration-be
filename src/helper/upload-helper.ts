import streamifier from "streamifier";
import cloudinary from "../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
