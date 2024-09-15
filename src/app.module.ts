import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PhongModule } from './phong/phong.module';
import { ViTriModule } from './vitri/vitri.module';
import { DatPhongModule } from './datphong/datphong.module';
import { BinhLuanModule } from './binhluan/binhluan.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PhongModule,
    ViTriModule,
    DatPhongModule,
    BinhLuanModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Directory to serve static files from
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
