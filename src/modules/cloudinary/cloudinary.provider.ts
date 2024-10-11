import { v2 as cloudinary } from 'cloudinary';
import { configSystem } from '../../../config/system.config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
        cloud_name: configSystem.CloudName,
        api_key: configSystem.CloudKey,
        api_secret: configSystem.CloudSecret
    });
  },
};
