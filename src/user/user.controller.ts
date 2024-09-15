import {
  Controller, Get, Post, Body, Put, Param, Delete, Query, HttpException,
  HttpStatus, BadRequestException, NotFoundException, UploadedFile, UseInterceptors, Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as sharp from 'sharp';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger'; // Import Swagger decorators

@ApiTags('Users') // Nhóm các API dưới tag 'Users'
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' }) // Mô tả API
  @ApiResponse({ status: 201, description: 'Người dùng đã được tạo thành công.' })
  @ApiResponse({ status: 400, description: 'Email đã tồn tại.' })
  @ApiBody({ type: CreateUserDto }) // Mô tả body của request (CreateUserDto)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.pass_word, saltOrRounds);
      const userData = {
        ...createUserDto,
        pass_word: hashedPassword,
      };
      const user = await this.prismaService.nguoiDung.create({ data: userData });
      return {
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy người dùng thành công.' })
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
  @ApiOperation({ summary: 'Phân trang người dùng' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang', example: '1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng người dùng mỗi trang', example: '10' })
  @ApiResponse({ status: 200, description: 'Phân trang thành công.' })
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
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo tên' })
  @ApiQuery({ name: 'name', required: true, description: 'Tên người dùng để tìm kiếm' })
  @ApiResponse({ status: 200, description: 'Tìm kiếm thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng.' })
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
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin người dùng thành công.' })
  @ApiResponse({ status: 404, description: 'Người dùng không tìm thấy.' })
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
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  @ApiParam({ name: 'id', description: 'ID của người dùng cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công.' })
  @ApiResponse({ status: 404, description: 'Người dùng không tìm thấy.' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.nguoiDung.findUnique({ where: { id: Number(id) } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (updateUserDto.pass_word) {
        updateUserDto.pass_word = await bcrypt.hash(updateUserDto.pass_word, 10);
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
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiParam({ name: 'id', description: 'ID của người dùng cần xóa' })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công.' })
  @ApiResponse({ status: 404, description: 'Người dùng không tìm thấy.' })
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
  @ApiOperation({ summary: 'Upload avatar cho người dùng' })
  @ApiParam({ name: 'id', description: 'ID của người dùng' })
  @ApiResponse({ status: 200, description: 'Upload avatar thành công.' })
  @ApiResponse({ status: 404, description: 'Người dùng không tìm thấy.' })
  async uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        this.logger.error('No file uploaded');
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const user = await this.prismaService.nguoiDung.findUnique({ where: { id: Number(id) } });
      if (!user) {
        this.logger.error(`User not found: ${id}`);
        throw new NotFoundException('User not found');
      }

      const resizedImageBuffer = await sharp(file.path)
        .resize(150, 150)
        .toBuffer();

      const resizedFilename = `${Date.now()}-resized${extname(file.originalname)}`;
      const resizedFilePath = `./uploads/avatars/${resizedFilename}`;
      await sharp(resizedImageBuffer).toFile(resizedFilePath);

      const base64Image = resizedImageBuffer.toString('base64');
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
