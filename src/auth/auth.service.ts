import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { RegisterDto } from './dtos/auth.dto';
import { NguoiDung as User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  register = async (userData: RegisterDto): Promise<User> => {
    const user = await this.prismaService.nguoiDung.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (user) {
      throw new HttpException(
        { message: 'This email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(userData.pass_word, 10);
    const res = await this.prismaService.nguoiDung.create({
      data: { ...userData, pass_word: hashedPassword },
    });
    return res;
  };

  login = async (data: { email: string; pass_word: string }): Promise<{ accessToken: string; refreshToken: string }> => {
    const user = await this.prismaService.nguoiDung.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Account does not exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const verify = await compare(data.pass_word, user.pass_word);
    if (!verify) {
      throw new HttpException(
        { message: 'Password is wrong' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { email: user.email, id: user.id, name: user.name };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,  // Change to match .env
      expiresIn: '1h',
    });
    
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '10d',
    });
    

    return { accessToken, refreshToken };
  };
}
