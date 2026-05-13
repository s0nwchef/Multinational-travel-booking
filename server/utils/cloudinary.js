import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_URL_PATTERN = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/;

let isConfigured = false;

const ensureCloudinaryConfigured = () => {
  if (isConfigured) {
    return;
  }

  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  if (!cloudinaryUrl) {
    throw new Error('CLOUDINARY_URL is not configured');
  }

  const match = cloudinaryUrl.match(CLOUDINARY_URL_PATTERN);
  if (!match) {
    throw new Error('CLOUDINARY_URL format is invalid');
  }

  const [, apiKey, apiSecret, cloudName] = match;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });

  isConfigured = true;
};

export const uploadBufferToCloudinary = (buffer, options = {}) => new Promise((resolve, reject) => {
  ensureCloudinaryConfigured();

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'travel-booking/reviews',
      resource_type: 'image',
      ...options
    },
    (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    }
  );

  stream.end(buffer);
});

export const uploadReviewMedia = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = await Promise.all(
    files.map((file, index) => uploadBufferToCloudinary(file.buffer, {
      public_id: `${Date.now()}-${index}-${file.originalname?.replace(/\.[^.]+$/, '')}`
    }))
  );

  return uploads
    .map((result) => result?.secure_url || result?.url)
    .filter(Boolean);
};