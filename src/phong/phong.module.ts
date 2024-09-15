import { Module } from '@nestjs/common';
import { PhongController } from './phong.controller';
import { PrismaModule } from 'src/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [PhongController],
})
export class PhongModule {}
