import { Injectable } from '@nestjs/common';
import { createWriteStream, unlink, readFile } from 'fs';

@Injectable()
export class StorageService {
  async saveImage(
    file: Express.Multer.File,
    userId: string,
    userImage?: string,
  ): Promise<string> {
    const filename = `${userId}-${Date.now()}-${file.originalname}`;
    const path = `uploads/${filename}`;

    if (!file && !file.buffer && !file.originalname) {
      throw new Error('file corrupted');
    }
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      throw new Error('file type mismatch');
    }

    // Check if the file already exists
    if (userImage) {
      unlink(`uploads/${userImage}`, () => {
        console.log('file was deleted');
      });
    }

    return new Promise((resolve, reject) =>
      createWriteStream(path)
        .end(file.buffer)
        .on('finish', () => resolve(filename))
        .on('error', (error) => reject(error)),
    );
  }

  async getImagePath(filename: string): Promise<Buffer | null> {
    const imagePath = `uploads/${filename}`;

    return new Promise((resolve, reject) => {
      readFile(imagePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
