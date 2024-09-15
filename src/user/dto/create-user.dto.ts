import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  // Import Swagger decorator

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email của người dùng',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu người dùng',
    example: 'StrongPassw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  pass_word: string;

  @ApiProperty({
    description: 'Số điện thoại của người dùng',
    example: '0987654321',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Ngày sinh của người dùng',
    example: '1990-01-01',
  })
  @IsString()
  @IsNotEmpty()
  birth_day: string;

  @ApiProperty({
    description: 'Giới tính của người dùng',
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'Vai trò của người dùng',
    example: 'user',
    enum: ['user', 'admin'],
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
