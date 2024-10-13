import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File not found');
        }

        // Kiểm tra kích thước file (2MB)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new BadRequestException(`File size exceeds the limit of 2MB`);
        }

        // Kiểm tra loại file (chỉ cho phép jpeg, jpg, png)
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG, JPG, and PNG are allowed');
        }

        return file;
    }
}
