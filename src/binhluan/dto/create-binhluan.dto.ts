import { ApiProperty } from '@nestjs/swagger';

export class CreateBinhLuanDto {
  @ApiProperty({
    description: 'Mã của công việc được bình luận',
    example: 123,
  })
  ma_cong_viec: number;

  @ApiProperty({
    description: 'Mã của người bình luận',
    example: 456,
  })
  ma_nguoi_binh_luan: number;

  @ApiProperty({
    description: 'Ngày bình luận',
    example: '2024-09-15T00:00:00Z',
    type: Date,
  })
  ngay_binh_luan: Date;

  @ApiProperty({
    description: 'Nội dung của bình luận',
    example: 'Công việc rất tốt, tôi rất hài lòng!',
  })
  noi_dung: string;

  @ApiProperty({
    description: 'Số sao bình luận (1-5)',
    example: 5,
  })
  sao_binh_luan: number;
}
