import { config } from './config';
import multer, { Multer } from 'multer';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

interface CloudinaryConfig {
  cloud_name: string | undefined;
  api_key: string | undefined;
  api_secret: string | undefined;
}



// Function to configure Cloudinary
export const cloudinaryConnect = (): void => {

    const {api_key,api_secret,cloud_name} = config.cloudinary;

  try {
    // Check for undefined environment variables
    if (!cloud_name || !api_key || !api_secret) {
      throw new Error('Missing Cloudinary configuration');
    }

    cloudinary.config({
      cloud_name: cloud_name,
      api_key: api_key,
      api_secret: api_secret,
    });
    
    console.log('Cloudinary configured successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error occurred while configuring Cloudinary:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};
