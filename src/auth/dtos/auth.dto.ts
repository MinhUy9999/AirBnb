import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    { message: 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.' }
  )
  pass_word: string;

  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phone: string;

  @IsString()
  birth_day: string;

  @IsString()
  gender: string;

  @IsString()
  role: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  pass_word: string;
}
