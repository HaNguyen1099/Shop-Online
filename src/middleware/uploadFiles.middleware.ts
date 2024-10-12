import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CloudinaryService } from '../base/cloudinary/cloudinary.service';
import multer from 'multer';

@Injectable()
export class UploadFilesMiddleware implements NestMiddleware {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const upload = multer().array('images', 5); // Upload tối đa 5 ảnh
        
        upload(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ message: 'File upload failed' });
        }

        // Xử lý upload ảnh lên Cloudinary
        const files = req.files as Express.Multer.File[];
        const uploadResults = await Promise.all(
            files.map(file => this.cloudinaryService.uploadFile(file))
        );

        // Lưu URL ảnh vào req.body hoặc req.uploadedFiles
        req.body.images = uploadResults.map(result => result.url);

        next();
        });
    }
}
