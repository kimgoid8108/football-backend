import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정 (프론트엔드에서 접근 가능하도록)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // 유효성 검사 파이프 설정
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // API 프리픽스 설정
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log('🚀 백엔드 서버가 http://localhost:3001 에서 실행 중입니다.');
}
bootstrap();
