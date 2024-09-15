import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Import Swagger
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation') // Tên tài liệu Swagger
    .setDescription('API documentation for the application') // Mô tả
    .setVersion('1.0') // Phiên bản API
    .addBearerAuth() // Thêm xác thực Bearer (JWT nếu có)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Đăng ký Swagger module và thiết lập URL truy cập Swagger UI
  SwaggerModule.setup('api', app, document); // URL là '/api'

  // Lắng nghe ứng dụng trên cổng 3000
  await app.listen(3000);
}
bootstrap();
