import { ApiProperty } from '@nestjs/swagger';

export class CreateViTriDto {
  @ApiProperty({
    description: 'Tên của vị trí',
    example: 'Bãi biển Nha Trang',
  })
  ten_vi_tri: string;

  @ApiProperty({
    description: 'Tỉnh/Thành phố của vị trí',
    example: 'Khánh Hòa',
  })
  tinh_thanh: string;

  @ApiProperty({
    description: 'Quốc gia của vị trí',
    example: 'Việt Nam',
  })
  quoc_gia: string;

  @ApiProperty({
    description: 'Hình ảnh đại diện của vị trí',
    example: 'https://example.com/image.jpg',
  })
  hinh_anh: string;
}
