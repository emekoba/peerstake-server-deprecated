import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // await app.listen(process.env.PORT || 9200);
  await app.listen(9200);
}
bootstrap();
