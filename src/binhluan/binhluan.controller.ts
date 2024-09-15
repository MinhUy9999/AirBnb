import {
    Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma.service';
  import { CreateBinhLuanDto } from './dto/create-binhluan.dto';
  import { UpdateBinhLuanDto } from './dto/update-binhluan.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'; // Import Swagger decorators
  
  @ApiTags('BinhLuan')  // Gán nhóm API cho các endpoint liên quan đến BinhLuan
  @Controller('binhluan')
  export class BinhLuanController {
    constructor(private readonly prismaService: PrismaService) {}
  
    @Post()
    @ApiOperation({ summary: 'Tạo mới bình luận' })  // Mô tả ngắn gọn về API này
    @ApiResponse({ status: 201, description: 'Bình luận đã được tạo thành công.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi tạo bình luận.' })
    @ApiBody({ type: CreateBinhLuanDto })  // Mô tả chi tiết về body request (DTO)
    async create(@Body() createBinhLuanDto: CreateBinhLuanDto) {
      try {
        const binhLuan = await this.prismaService.binhLuan.create({ data: createBinhLuanDto });
        return { message: 'BinhLuan created successfully', data: binhLuan };
      } catch (error) {
        throw new HttpException('Failed to create BinhLuan', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả bình luận' })
    @ApiResponse({ status: 200, description: 'Lấy danh sách bình luận thành công.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi lấy danh sách bình luận.' })
    async findAll() {
      try {
        const binhLuan = await this.prismaService.binhLuan.findMany();
        return { message: 'BinhLuan retrieved successfully', data: binhLuan };
      } catch (error) {
        throw new HttpException('Failed to retrieve BinhLuan', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin bình luận theo ID' })
    @ApiParam({ name: 'id', description: 'ID của bình luận' })
    @ApiResponse({ status: 200, description: 'Lấy thông tin bình luận thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi lấy thông tin bình luận.' })
    async findOne(@Param('id') id: string) {
      try {
        const binhLuan = await this.prismaService.binhLuan.findUnique({ where: { id: Number(id) } });
        if (!binhLuan) {
          throw new HttpException('BinhLuan not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'BinhLuan retrieved successfully', data: binhLuan };
      } catch (error) {
        throw new HttpException('Failed to retrieve BinhLuan', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật bình luận' })
    @ApiParam({ name: 'id', description: 'ID của bình luận cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Cập nhật bình luận thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi cập nhật bình luận.' })
    @ApiBody({ type: UpdateBinhLuanDto })  // Mô tả chi tiết về body request
    async update(@Param('id') id: string, @Body() updateBinhLuanDto: UpdateBinhLuanDto) {
      try {
        const binhLuan = await this.prismaService.binhLuan.findUnique({ where: { id: Number(id) } });
        if (!binhLuan) {
          throw new HttpException('BinhLuan not found', HttpStatus.NOT_FOUND);
        }
        const updatedBinhLuan = await this.prismaService.binhLuan.update({
          where: { id: Number(id) },
          data: updateBinhLuanDto,
        });
        return { message: 'BinhLuan updated successfully', data: updatedBinhLuan };
      } catch (error) {
        throw new HttpException('Failed to update BinhLuan', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Xóa bình luận' })
    @ApiParam({ name: 'id', description: 'ID của bình luận cần xóa' })
    @ApiResponse({ status: 200, description: 'Xóa bình luận thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi xóa bình luận.' })
    async remove(@Param('id') id: string) {
      try {
        const binhLuan = await this.prismaService.binhLuan.findUnique({ where: { id: Number(id) } });
        if (!binhLuan) {
          throw new HttpException('BinhLuan not found', HttpStatus.NOT_FOUND);
        }
        await this.prismaService.binhLuan.delete({ where: { id: Number(id) } });
        return { message: 'BinhLuan deleted successfully' };
      } catch (error) {
        throw new HttpException('Failed to delete BinhLuan', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  