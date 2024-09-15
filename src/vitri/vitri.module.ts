import { Module } from '@nestjs/common';
import { ViTriController } from './vitri.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ViTriController],
})
export class ViTriModule {}
