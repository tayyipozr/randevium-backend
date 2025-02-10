import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import * as multer from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':entityType/:entityId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Sadece resim dosyası yükleyin!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum 5MB
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const imageUrl = `/uploads/${file.filename}`;
    const savedImage = await this.uploadService.saveImage(
      imageUrl,
      entityId,
      entityType,
    );

    return { message: 'Resim başarıyla yüklendi', savedImage };
  }

  @Get(':entityType/:entityId')
  async getImages(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    const images = await this.uploadService.getImages(entityId, entityType);

    if (!images || images.length === 0) {
      throw new BadRequestException('Resim bulunamadı');
    }

    return images;
  }
}
