import { Request, Response } from 'express';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

interface UploadOptions {
  folder?: string;
  height?: number;
  quality?: number;
  resource_type?: 'auto' | 'image' | 'video';
}

// `Express.Multer.File` type from `multer`
interface MulterFile extends Express.Multer.File {}

// If using a different file interface, define it accordingly
interface LocalFile {
  tempFilePath: string;
}

export const uploadToCloudinary = async (
  file: MulterFile | LocalFile | any,
  folder?: string,
  height?: number,
  quality?: number
): Promise<string | void> => {
  try {
    const options: UploadOptions = { folder };

    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = 'auto';

    // Determine if file is MulterFile or LocalFile
    if ('path' in file) {
      // Assuming MulterFile has `path`
      const image = await cloudinary.uploader.upload(file.path, options);
      return image.secure_url;
    } else if ('tempFilePath' in file) {
      // Assuming LocalFile has `tempFilePath`
      const image = await cloudinary.uploader.upload(file.tempFilePath, options);
      return image.secure_url;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error occurred while uploading image:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};

