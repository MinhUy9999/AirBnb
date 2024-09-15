import {
    Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus,
    UploadedFile, UseInterceptors, Logger
  } from '@nestjs/common';
  import { PrismaService } from '../prisma.service';
  import { CreatePhongDto } from './dto/create-phong.dto';
  import { UpdatePhongDto } from './dto/update-phong.dto';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { FileInterceptor } from '@nestjs/platform-express';
  import * as sharp from 'sharp';
  import { Express } from 'express';
  import { promises as fs } from 'fs';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'; // Import Swagger decorators
  
  @ApiTags('Phong')  // Gán nhóm API cho các endpoint liên quan đến Phong
  @Controller('phong')
  export class PhongController {
    private readonly logger = new Logger(PhongController.name);
  
    constructor(private readonly prismaService: PrismaService) {}
  
    @Post()
    @ApiOperation({ summary: 'Tạo mới phòng' })  // Mô tả ngắn gọn về API này
    @ApiResponse({ status: 201, description: 'Phòng đã được tạo thành công.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi tạo phòng.' })
    @ApiBody({ type: CreatePhongDto })  // Mô tả chi tiết về body request (DTO)
    async create(@Body() createPhongDto: CreatePhongDto) {
      try {
        const phong = await this.prismaService.phong.create({ data: createPhongDto });
        return { message: 'Phong created successfully', data: phong };
      } catch (error) {
        throw new HttpException('Failed to create Phong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post(':id/upload-image')
    @ApiOperation({ summary: 'Upload hình ảnh cho phòng' })
    @ApiParam({ name: 'id', description: 'ID của phòng cần upload hình ảnh' })
    @ApiResponse({ status: 200, description: 'Hình ảnh được upload và xử lý thành công.' })
    @ApiResponse({ status: 404, description: 'Phòng không tìm thấy.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi upload và xử lý hình ảnh.' })
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/phong-images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, uniqueSuffix + ext);
        },
      }),
    }))
    async uploadImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
      try {
        if (!file) {
          this.logger.error('No file uploaded');
          throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }
  
        const phong = await this.prismaService.phong.findUnique({ where: { id: Number(id) } });
        if (!phong) {
          this.logger.error(`Phong not found: ${id}`);
          throw new HttpException('Phong not found', HttpStatus.NOT_FOUND);
        }
  
        this.logger.log('Starting image resizing process');
        const resizedImageBuffer = await sharp(file.path).resize(300, 300).toBuffer();
        this.logger.log('Image resizing completed');
  
        const resizedFilename = `${Date.now()}-resized${extname(file.originalname)}`;
        const resizedFilePath = `./uploads/phong-images/${resizedFilename}`;
        await sharp(resizedImageBuffer).toFile(resizedFilePath);
        this.logger.log(`Resized image saved to ${resizedFilePath}`);
  
        const imageBuffer = await fs.readFile(resizedFilePath);
        const base64Image = imageBuffer.toString('base64');
  
        await this.prismaService.phong.update({
          where: { id: Number(id) },
          data: {
            hinh_anh: resizedFilePath,
          },
        });
  
        return {
          message: 'Image uploaded and resized successfully',
          data: {
            url: resizedFilePath,
            base64: base64Image,
          },
        };
      } catch (error) {
        this.logger.error('Failed to upload and process image', error.stack);
        throw new HttpException('Failed to upload and process image', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả các phòng' })
    @ApiResponse({ status: 200, description: 'Lấy danh sách thành công.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi lấy danh sách phòng.' })
    async findAll() {
      try {
        const phong = await this.prismaService.phong.findMany();
        return { message: 'Phong retrieved successfully', data: phong };
      } catch (error) {
        throw new HttpException('Failed to retrieve Phong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin phòng theo ID' })
    @ApiParam({ name: 'id', description: 'ID của phòng' })
    @ApiResponse({ status: 200, description: 'Lấy thông tin phòng thành công.' })
    @ApiResponse({ status: 404, description: 'Phòng không tìm thấy.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi lấy thông tin phòng.' })
    async findOne(@Param('id') id: string) {
      try {
        const phong = await this.prismaService.phong.findUnique({ where: { id: Number(id) } });
        if (!phong) {
          throw new HttpException('Phong not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'Phong retrieved successfully', data: phong };
      } catch (error) {
        throw new HttpException('Failed to retrieve Phong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật thông tin phòng' })
    @ApiParam({ name: 'id', description: 'ID của phòng cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Cập nhật phòng thành công.' })
    @ApiResponse({ status: 404, description: 'Phòng không tìm thấy.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi cập nhật phòng.' })
    @ApiBody({ type: UpdatePhongDto })  // Mô tả chi tiết về body request
    async update(@Param('id') id: string, @Body() updatePhongDto: UpdatePhongDto) {
      try {
        const phong = await this.prismaService.phong.findUnique({ where: { id: Number(id) } });
        if (!phong) {
          throw new HttpException('Phong not found', HttpStatus.NOT_FOUND);
        }
        const updatedPhong = await this.prismaService.phong.update({
          where: { id: Number(id) },
          data: updatePhongDto,
        });
        return { message: 'Phong updated successfully', data: updatedPhong };
      } catch (error) {
        throw new HttpException('Failed to update Phong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Xóa phòng' })
    @ApiParam({ name: 'id', description: 'ID của phòng cần xóa' })
    @ApiResponse({ status: 200, description: 'Xóa phòng thành công.' })
    @ApiResponse({ status: 404, description: 'Phòng không tìm thấy.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi xóa phòng.' })
    async remove(@Param('id') id: string) {
      try {
        const phong = await this.prismaService.phong.findUnique({ where: { id: Number(id) } });
        if (!phong) {
          throw new HttpException('Phong not found', HttpStatus.NOT_FOUND);
        }
        await this.prismaService.phong.delete({ where: { id: Number(id) } });
        return { message: 'Phong deleted successfully' };
      } catch (error) {
        throw new HttpException('Failed to delete Phong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  