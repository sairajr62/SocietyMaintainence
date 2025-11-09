import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Configure Cloudinary storage for PDFs or any file type
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'documents',  // Cloudinary folder name
        resource_type: 'auto' // handles pdf, docx, images, etc.
    },
});

const upload = multer({ storage });

export default upload;
