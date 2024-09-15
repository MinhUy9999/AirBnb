import { PartialType } from '@nestjs/mapped-types';
import { CreateBinhLuanDto } from './create-binhluan.dto';

export class UpdateBinhLuanDto extends PartialType(CreateBinhLuanDto) {}
