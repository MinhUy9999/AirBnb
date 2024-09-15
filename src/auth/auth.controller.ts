import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NguoiDung as User } from '@prisma/client';
import { LoginDto, RegisterDto } from './dtos/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'; // Import Swagger decorators

@ApiTags('Auth') // Tag nhóm các API liên quan đến Auth
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Đăng ký người dùng mới' }) // Mô tả mục đích của API
  @ApiResponse({ status: 201, description: 'Người dùng đã được tạo thành công.' }) // Phản hồi thành công
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' }) // Phản hồi khi dữ liệu không hợp lệ
  @ApiBody({ type: RegisterDto }) // Mô tả dữ liệu body (RegisterDto)
  async register(@Body() body: RegisterDto): Promise<User> {
    return this.authService.register(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập người dùng' }) // Mô tả mục đích của API
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công.' }) // Phản hồi thành công
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không chính xác.' }) // Phản hồi khi xác thực thất bại
  @ApiBody({ type: LoginDto }) // Mô tả dữ liệu body (LoginDto)
  async login(@Body() body: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(body);
  }
}
