// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
;
import { AuthModule } from '../auth/auth.module';  // Import AuthModule
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],  // Import AuthModule to have access to JwtService
  controllers: [UserController],
})
export class UserModule {}
