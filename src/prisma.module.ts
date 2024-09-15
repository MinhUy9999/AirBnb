// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // Makes PrismaModule globally available
@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Export PrismaService so it can be used in other modules
})
export class PrismaModule {}
