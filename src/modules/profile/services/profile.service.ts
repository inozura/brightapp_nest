import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from 'src/schemas/profile.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { ProfileRequestDTO } from '../dtos/request/profile-request.dto';
import { StorageService } from 'src/modules/storage/storage.service';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private storageService: StorageService,
  ) {}

  async create(
    ProfileRequestDTO: ProfileRequestDTO,
    userId: string,
    image: Express.Multer.File,
  ) {
    const checkProfile = await this.profileModel.findOne({ userId: userId });
    if (checkProfile) {
      throw new HttpException(
        'User already create profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (image !== undefined || ProfileRequestDTO.image !== '') {
      const uploadImage = await this.storageService
        .saveImage(image, userId)
        .catch((err) => {
          console.error(err);

          throw new HttpException(
            'Error when try to upload image',
            HttpStatus.BAD_REQUEST,
          );
        });

      ProfileRequestDTO.image = uploadImage;
    } else {
      delete ProfileRequestDTO.image;
    }

    ProfileRequestDTO.userId = userId;

    const createProfile = new this.profileModel(ProfileRequestDTO);
    await createProfile.save();

    return {
      success: true,
      data: ProfileRequestDTO,
    };
  }

  async getById(userId: string) {
    const user = await this.profileModel.findOne({ userId: userId });

    return {
      success: true,
      data: user,
    };
  }

  async update(
    ProfileRequestDTO: ProfileRequestDTO,
    userId: string,
    image: Express.Multer.File,
  ) {
    const user = await this.userModel.findById({ _id: userId });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }

    if (image != undefined) {
      const uploadImage = await this.storageService
        .saveImage(image, userId, ProfileRequestDTO.image)
        .catch(() => {
          throw new HttpException(
            'error when try to upload image',
            HttpStatus.BAD_REQUEST,
          );
        });

      ProfileRequestDTO.image = uploadImage;
    }

    const update = await this.profileModel.updateOne(
      { userId: userId },
      ProfileRequestDTO,
    );

    if (update.modifiedCount < 1) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }

  async getImage(userId: string) {
    const user = await this.profileModel.findOne({ userId }).exec();
    if (!user || !user?.image)
      return {
        success: true,
        data: null,
      };

    const imageCheck = await this.storageService.getImagePath(user.image);

    if (imageCheck === null) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    const file = join(__dirname, '../../..', 'uploads', user.image);
    const fileExt = user.image.split('.')[1];
    const buffer = readFileSync(file);
    const base64String = Buffer.from(buffer).toString('base64');

    return {
      success: true,
      data: `data:image/${fileExt};base64,` + base64String,
    };
  }
}
