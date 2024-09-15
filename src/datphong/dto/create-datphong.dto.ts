import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsDateString } from 'class-validator';

export class CreateDatPhongDto {
  @ApiProperty({
    description: 'Mã phòng đã đặt',
    example: 101,
  })
  @IsInt()
  @IsPositive()
  ma_phong: number;

  @ApiProperty({
    description: 'Ngày nhận phòng',
    example: '2024-09-15T00:00:00Z',
    type: Date,
  })
  @IsDateString()
  ngay_den: Date;

  @ApiProperty({
    description: 'Ngày trả phòng',
    example: '2024-09-20T00:00:00Z',
    type: Date,
  })
  @IsDateString()
  ngay_di: Date;

  @ApiProperty({
    description: 'Số lượng khách đặt phòng',
    example: 2,
  })
  @IsInt()
  @IsPositive()
  so_luong_khach: number;

  @ApiProperty({
    description: 'Mã của người đặt phòng',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  ma_nguoi_dat: number;
}
