import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LoginRequestDTO } from '../dtos/request/login-request.dto';
import { RegisterRequestDTO } from '../dtos/request/register-request.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(LoginRequestDTO: LoginRequestDTO) {
    const { email, password } = LoginRequestDTO;

    if (!email || !password) {
      throw new HttpException(
        'email and password is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.model.findOne({ email });

    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      const payload = { email: email, username: user.username, sub: user._id };

      return {
        success: true,
        token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async create(RegisterRequestDTO: RegisterRequestDTO) {
    const { email, password, username } = RegisterRequestDTO;

    if (!email || !password || !username) {
      throw new HttpException(
        'email, username and password is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.model.findOne({ email });

    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.model(RegisterRequestDTO);
    await createdUser.save();

    return {
      email,
      success: true,
    };
  }
}
