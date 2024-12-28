export interface SaveImageRequestDTO {
  file: Express.Multer.File;
  userId: string;
  userImage?: string;
  type?: 'local' | 'cloudinary';
}
