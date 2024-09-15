import { Module } from '@nestjs/common';
import { BinhLuanController } from './binhluan.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BinhLuanController],
})
export class BinhLuanModule {}
