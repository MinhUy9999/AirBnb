import {
    Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma.service';
  import { CreateDatPhongDto } from './dto/create-datphong.dto';
  import { UpdateDatPhongDto } from './dto/update-datphong.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'; // Import Swagger decorators
  
  @ApiTags('DatPhong')  // Gán nhóm API cho các endpoint liên quan đến Đặt Phòng
  @Controller('datphong')
  export class DatPhongController {
    constructor(private readonly prismaService: PrismaService) {}
  
    @Post()
    @ApiOperation({ summary: 'Tạo mới Đặt Phòng' })  // Mô tả ngắn gọn về API này
    @ApiResponse({ status: 201, description: 'Đặt phòng đã được tạo thành công.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi tạo đặt phòng.' })
    @ApiBody({ type: CreateDatPhongDto })  // Mô tả chi tiết về body request (DTO)
    async create(@Body() createDatPhongDto: CreateDatPhongDto) {
      try {
        const datPhong = await this.prismaService.datPhong.create({ data: createDatPhongDto });
        return { message: 'DatPhong created successfully', data: datPhong };
      } catch (error) {
        console.error('Error creating DatPhong:', error);  // Log the actual error for debugging
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Failed to create DatPhong',
            details: error.message || error,  // Include more details from the error
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    
  
    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả Đặt Phòng' })
    @ApiResponse({ status: 200, description: 'Lấy danh sách thành công.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi lấy danh sách Đặt Phòng.' })
    async findAll() {
      try {
        const datPhong = await this.prismaService.datPhong.findMany();
        return { message: 'DatPhong retrieved successfully', data: datPhong };
      } catch (error) {
        throw new HttpException('Failed to retrieve DatPhong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin Đặt Phòng theo ID' })
    @ApiParam({ name: 'id', description: 'ID của Đặt Phòng' })
    @ApiResponse({ status: 200, description: 'Lấy thông tin đặt phòng thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy Đặt Phòng.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi lấy thông tin Đặt Phòng.' })
    async findOne(@Param('id') id: string) {
      try {
        const datPhong = await this.prismaService.datPhong.findUnique({ where: { id: Number(id) } });
        if (!datPhong) {
          throw new HttpException('DatPhong not found', HttpStatus.NOT_FOUND);
        }
        return { message: 'DatPhong retrieved successfully', data: datPhong };
      } catch (error) {
        throw new HttpException('Failed to retrieve DatPhong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật Đặt Phòng' })
    @ApiParam({ name: 'id', description: 'ID của Đặt Phòng cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Cập nhật Đặt Phòng thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy Đặt Phòng.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi cập nhật Đặt Phòng.' })
    @ApiBody({ type: UpdateDatPhongDto })  // Mô tả chi tiết về body request
    async update(@Param('id') id: string, @Body() updateDatPhongDto: UpdateDatPhongDto) {
      try {
        const datPhong = await this.prismaService.datPhong.findUnique({ where: { id: Number(id) } });
        if (!datPhong) {
          throw new HttpException('DatPhong not found', HttpStatus.NOT_FOUND);
        }
        const updatedDatPhong = await this.prismaService.datPhong.update({
          where: { id: Number(id) },
          data: updateDatPhongDto,
        });
        return { message: 'DatPhong updated successfully', data: updatedDatPhong };
      } catch (error) {
        throw new HttpException('Failed to update DatPhong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Xóa Đặt Phòng' })
    @ApiParam({ name: 'id', description: 'ID của Đặt Phòng cần xóa' })
    @ApiResponse({ status: 200, description: 'Xóa Đặt Phòng thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy Đặt Phòng.' })
    @ApiResponse({ status: 500, description: 'Lỗi khi xóa Đặt Phòng.' })
    async remove(@Param('id') id: string) {
      try {
        const datPhong = await this.prismaService.datPhong.findUnique({ where: { id: Number(id) } });
        if (!datPhong) {
          throw new HttpException('DatPhong not found', HttpStatus.NOT_FOUND);
        }
        await this.prismaService.datPhong.delete({ where: { id: Number(id) } });
        return { message: 'DatPhong deleted successfully' };
      } catch (error) {
        throw new HttpException('Failed to delete DatPhong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  