import { IsString, IsEmail, MinLength, MaxLength, Matches, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Name must be a string.' })
  @MinLength(2, { message: 'Name must be at least 2 characters long.' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters.' })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassw0rd!',
    minLength: 8,
    maxLength: 20,
  })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters.' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  pass_word: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '1234567890',
    minLength: 10,
    maxLength: 15,
  })
  @IsString({ message: 'Phone must be a string.' })
  @MinLength(10, { message: 'Phone must be at least 10 characters long.' })
  @MaxLength(15, { message: 'Phone must not exceed 15 characters.' })
  phone: string;

  @ApiProperty({
    description: 'Birth date of the user',
    example: '1990-01-01',
    type: String,
  })
  @IsDateString({}, { message: 'Birth date must be a valid date string.' })
  birth_day: string;

  @ApiProperty({
    description: 'Gender of the user',
    enum: ['male', 'female', 'other'],
    example: 'male',
  })
  @IsIn(['male', 'female', 'other'], {
    message: 'Gender must be either male, female, or other.',
  })
  gender: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: ['user', 'admin'],
    example: 'user',
  })
  @IsIn(['user', 'admin'], { message: 'Role must be either user or admin.' })
  role: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassw0rd!',
  })
  @IsString({ message: 'Password must be a string.' })
  pass_word: string;
}
