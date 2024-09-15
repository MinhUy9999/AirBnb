import { Module } from '@nestjs/common';
import { DatPhongController } from './datphong.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DatPhongController],
})
export class DatPhongModule {}
