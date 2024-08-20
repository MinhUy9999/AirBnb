import { Controller, Get, Post, Body, Put, Param, Delete, Query, HttpException, HttpStatus, BadRequestException, NotFoundException, UploadedFile, UseInterceptors, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { diskStorage, } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as sharp from 'sharp';



@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.nguoiDung.create({ data: createUserDto });
      return {
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint error code
        throw new BadRequestException('Email already exists');
      }
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.prismaService.nguoiDung.findMany();
      return {
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('paginate')
  async findPaginated(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      const users = await this.prismaService.nguoiDung.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      const totalUsers = await this.prismaService.nguoiDung.count();

      return {
        message: 'Users retrieved successfully',
        data: users,
        pagination: {
          totalItems: totalUsers,
          totalPages: Math.ceil(totalUsers / pageSize),
          currentPage: pageNumber,
          pageSize: pageSize,
        },
      };
    } catch (error) {
      throw new HttpException('Failed to retrieve paginated users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  async findByName(@Query('name') name: string) {
    try {
      const users = await this.prismaService.nguoiDung.findMany({
        where: {
          name: {
            contains: name.toLowerCase(),
          },
        },
      });
      if (users.length === 0) {
        throw new NotFoundException('No users found with the given name');
      }
      return {
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException('Failed to search users by name', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.prismaService.nguoiDung.findUnique({ where: { id: Number(id) } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException('Failed to retrieve user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.nguoiDung.findUnique({ where: { id: Number(id) } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Check if the password needs to be hashed
      if (updateUserDto.pass_word) {
        const salt = await bcrypt.genSalt(10);
        updateUserDto.pass_word = await bcrypt.hash(updateUserDto.pass_word, salt);
      }
  
      const updatedUser = await this.prismaService.nguoiDung.update({
        where: { id: Number(id) },
        data: updateUserDto,
      });
  
      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const user = await this.prismaService.nguoiDung.findUnique({ where: { id: Number(id) } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.prismaService.nguoiDung.delete({ where: { id: Number(id) } });
      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, uniqueSuffix + ext);
      },
    }),
  }))
  async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        this.logger.error('No file uploaded');
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }
  
      // Find user to validate if exists
      const user = await this.prismaService.nguoiDung.findUnique({ where: { id: Number(id) } });
      if (!user) {
        this.logger.error(`User not found: ${id}`);
        throw new NotFoundException('User not found');
      }
  
      // Resize the image
      this.logger.log('Starting image resizing process');
      let resizedImageBuffer: Buffer;
      try {
        resizedImageBuffer = await sharp(file.path)
          .resize(150, 150)  // Resize to 150x150 pixels
          .toBuffer();
        this.logger.log('Image resizing completed');
      } catch (err) {
        this.logger.error('Failed to resize image', err.stack);
        throw new HttpException('Failed to resize image', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
      // Save resized image
      const resizedFilename = `${Date.now()}-resized${extname(file.originalname)}`;
      const resizedFilePath = `./uploads/avatars/${resizedFilename}`;
      try {
        await sharp(resizedImageBuffer).toFile(resizedFilePath);
        this.logger.log(`Resized image saved to ${resizedFilePath}`);
      } catch (err) {
        this.logger.error('Failed to save resized image', err.stack);
        throw new HttpException('Failed to save resized image', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
      // Convert to base64
      let base64Image: string;
      try {
        base64Image = resizedImageBuffer.toString('base64');
        this.logger.log('Image converted to base64');
      } catch (err) {
        this.logger.error('Failed to convert image to base64', err.stack);
        throw new HttpException('Failed to convert image to base64', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
      const fileUrl = `/uploads/avatars/${resizedFilename}`;
      return {
        message: 'Avatar uploaded and resized successfully',
        data: {
          url: fileUrl,
          base64: base64Image,
        },
      };
    } catch (error) {
      this.logger.error('Failed to upload and process avatar', error.stack);
      throw new HttpException('Failed to upload and process avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}  