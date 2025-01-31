// Libraries
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

//call to environment variables


// Main module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET, POST, PUT, PATCH, POST, DELETE',
    credentials: true,
  });
  
  await app.listen(3000);
}

bootstrap();
