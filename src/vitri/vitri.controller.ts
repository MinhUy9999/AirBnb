import {
  Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus,
  UploadedFile, UseInterceptors, Logger
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateViTriDto } from './dto/create-vitri.dto';
import { UpdateViTriDto } from './dto/update-vitri.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';  // Để đọc file và chuyển đổi sang Base64
import { Express } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'; // Import Swagger decorators

@ApiTags('ViTri')  // Gán nhóm API cho các endpoint liên quan đến ViTri
@Controller('vitri')
export class ViTriController {
  private readonly logger = new Logger(ViTriController.name);

  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới vị trí' })  // Mô tả ngắn gọn về API này
  @ApiResponse({ status: 201, description: 'Vị trí đã được tạo thành công.' })
  @ApiResponse({ status: 500, description: 'Lỗi khi tạo vị trí.' })
  @ApiBody({ type: CreateViTriDto })  // Mô tả chi tiết về body request (DTO)
  async create(@Body() createViTriDto: CreateViTriDto) {
    try {
      const vitri = await this.prismaService.viTri.create({ data: createViTriDto });
      return { message: 'ViTri created successfully', data: vitri };
    } catch (error) {
      throw new HttpException('Failed to create ViTri', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Upload hình ảnh cho vị trí' })
  @ApiParam({ name: 'id', description: 'ID của vị trí cần upload hình ảnh' })
  @ApiResponse({ status: 200, description: 'Hình ảnh được upload và xử lý thành công.' })
  @ApiResponse({ status: 404, description: 'Vị trí không tìm thấy.' })
  @ApiResponse({ status: 500, description: 'Lỗi khi upload và xử lý hình ảnh.' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/vitri-images',
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

      const vitri = await this.prismaService.viTri.findUnique({ where: { id: Number(id) } });
      if (!vitri) {
        this.logger.error(`ViTri not found: ${id}`);
        throw new HttpException('ViTri not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log('Starting image resizing process');
      const resizedImageBuffer = await sharp(file.path).resize(300, 300).toBuffer();
      this.logger.log('Image resizing completed');

      const resizedFilename = `${Date.now()}-resized${extname(file.originalname)}`;
      const resizedFilePath = `./uploads/vitri-images/${resizedFilename}`;
      await sharp(resizedImageBuffer).toFile(resizedFilePath);
      this.logger.log(`Resized image saved to ${resizedFilePath}`);

      const imageBuffer = await fs.readFile(resizedFilePath);
      const base64Image = imageBuffer.toString('base64');

      await this.prismaService.viTri.update({
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
  @ApiOperation({ summary: 'Lấy danh sách tất cả các vị trí' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công.' })
  @ApiResponse({ status: 500, description: 'Lỗi khi lấy danh sách vị trí.' })
  async findAll() {
    try {
      const vitri = await this.prismaService.viTri.findMany();
      return { message: 'ViTri retrieved successfully', data: vitri };
    } catch (error) {
      throw new HttpException('Failed to retrieve ViTri', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin vị trí theo ID' })
  @ApiParam({ name: 'id', description: 'ID của vị trí' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin vị trí thành công.' })
  @ApiResponse({ status: 404, description: 'Vị trí không tìm thấy.' })
  @ApiResponse({ status: 500, description: 'Lỗi khi lấy thông tin vị trí.' })
  async findOne(@Param('id') id: string) {
    try {
      const vitri = await this.prismaService.viTri.findUnique({ where: { id: Number(id) } });
      if (!vitri) {
        throw new HttpException('ViTri not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'ViTri retrieved successfully', data: vitri };
    } catch (error) {
      throw new HttpException('Failed to retrieve ViTri', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin vị trí' })
  @ApiParam({ name: 'id', description: 'ID của vị trí cần cập nhật' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
  @ApiResponse({ status: 404, description: 'Vị trí không tìm thấy.' })
  @ApiResponse({ status: 500, description: 'Lỗi khi cập nhật vị trí.' })
  @ApiBody({ type: UpdateViTriDto })
  async update(@Param('id') id: string, @Body() updateViTriDto: UpdateViTriDto) {
    try {
      const vitri = await this.prismaService.viTri.findUnique({ where: { id: Number(id) } });
      if (!vitri) {
        throw new HttpException('ViTri not found', HttpStatus.NOT_FOUND);
      }
      const updatedViTri = await this.prismaService.viTri.update({
        where: { id: Number(id) },
        data: updateViTriDto,
      });
      return { message: 'ViTri updated successfully', data: updatedViTri };
    } catch (error) {
      throw new HttpException('Failed to update ViTri', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vị trí' })
  @ApiParam({ name: 'id', description: 'ID của vị trí cần xóa' })
  @ApiResponse({ status: 200, description: 'Xóa vị trí thành công.' })
  @ApiResponse({ status: 404, description: 'Vị trí không tìm thấy.' })
  @ApiResponse({ status: 500, description: 'Lỗi khi xóa vị trí.' })
  async remove(@Param('id') id: string) {
    try {
      const vitri = await this.prismaService.viTri.findUnique({ where: { id: Number(id) } });
      if (!vitri) {
        throw new HttpException('ViTri not found', HttpStatus.NOT_FOUND);
      }
      await this.prismaService.viTri.delete({ where: { id: Number(id) } });
      return { message: 'ViTri deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete ViTri', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
