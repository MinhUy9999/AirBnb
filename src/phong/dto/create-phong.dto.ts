import { ApiProperty } from '@nestjs/swagger';

export class CreatePhongDto {
  @ApiProperty({
    description: 'Tên của phòng',
    example: 'Deluxe Room',
  })
  ten_phong: string;

  @ApiProperty({
    description: 'Số khách tối đa có thể ở trong phòng',
    example: 2,
  })
  khach: number;

  @ApiProperty({
    description: 'Số phòng ngủ',
    example: 1,
  })
  phong_ngu: number;

  @ApiProperty({
    description: 'Số giường trong phòng',
    example: 1,
  })
  giuong: number;

  @ApiProperty({
    description: 'Số phòng tắm',
    example: 1,
  })
  phong_tam: number;

  @ApiProperty({
    description: 'Mô tả về phòng',
    example: 'Phòng đẹp với view biển',
  })
  mo_ta: string;

  @ApiProperty({
    description: 'Giá tiền của phòng mỗi đêm (VNĐ)',
    example: 1000000,
  })
  gia_tien: number;

  @ApiProperty({
    description: 'Phòng có máy giặt không',
    example: true,
  })
  may_giat: boolean;

  @ApiProperty({
    description: 'Phòng có bàn là không',
    example: false,
  })
  ban_la: boolean;

  @ApiProperty({
    description: 'Phòng có TV không',
    example: true,
  })
  tivi: boolean;

  @ApiProperty({
    description: 'Phòng có điều hòa không',
    example: true,
  })
  dieu_hoa: boolean;

  @ApiProperty({
    description: 'Phòng có wifi không',
    example: true,
  })
  wifi: boolean;

  @ApiProperty({
    description: 'Phòng có bếp không',
    example: false,
  })
  bep: boolean;

  @ApiProperty({
    description: 'Phòng có chỗ đỗ xe không',
    example: true,
  })
  do_xe: boolean;

  @ApiProperty({
    description: 'Phòng có bàn ủi không',
    example: false,
  })
  ban_ui: boolean;

  @ApiProperty({
    description: 'URL hình ảnh của phòng',
    example: 'https://example.com/image.jpg',
  })
  hinh_anh: string;

  @ApiProperty({
    description: 'ID của vị trí phòng',
    example: 1,
  })
  viTriId: number;
}
