import { PartialType } from '@nestjs/mapped-types';
import { CreateViTriDto } from './create-vitri.dto';

export class UpdateViTriDto extends PartialType(CreateViTriDto) {}
