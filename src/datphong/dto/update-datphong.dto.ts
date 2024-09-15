import { PartialType } from '@nestjs/mapped-types';
import { CreateDatPhongDto } from './create-datphong.dto';

export class UpdateDatPhongDto extends PartialType(CreateDatPhongDto) {}
