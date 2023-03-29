import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization']
  });
  await app.listen(3000);
}
bootstrap();
