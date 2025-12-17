import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정: 환경 변수에서 허용할 origin 목록 가져오기
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  const allowedOrigins = allowedOriginsEnv
    ? allowedOriginsEnv.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3001'];

  // Vercel 도메인 패턴 허용 (동적으로 모든 Vercel 하위 도메인 허용)
  const vercelPattern = /^https:\/\/.*\.vercel\.app$/;

  app.enableCors({
    origin: (origin, callback) => {
      // origin이 없으면 (같은 도메인 요청 등) 허용
      if (!origin) {
        return callback(null, true);
      }

      // 허용된 origin 목록에 있거나 Vercel 도메인인 경우 허용
      if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
        return callback(null, true);
      }

      // 개발 환경에서는 모든 origin 허용
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      callback(new Error('CORS 정책에 의해 차단되었습니다.'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 서버 실행 중: ${port}`);
}
bootstrap();
