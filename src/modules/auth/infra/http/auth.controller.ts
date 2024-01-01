import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { LoginRequestDTO } from '../../dtos/request/login-request.dto';
import { RegisterRequestDTO } from '../../dtos/request/register-request.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() LoginRequestDTO: LoginRequestDTO) {
    return this.authService.login(LoginRequestDTO);
  }

  @Post('/register')
  async register(@Body() RegisterRequestDTO: RegisterRequestDTO) {
    return this.authService.create(RegisterRequestDTO);
  }
}
