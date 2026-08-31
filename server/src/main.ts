import fastifyCsrf from '@fastify/csrf-protection';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StorageService } from './storage';
import FastifyCors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { seed } from './utils';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';

const bootstrap = async (): Promise<void> => {
  const adapter = new FastifyAdapter({});

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.register(FastifyCors, {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });
  await app.register(fastifyCsrf);
  await app.register(helmet);

  const port = process.env.PORT ?? 5555;
  const storage = app.get(StorageService);
  await seed(storage);

  await app.listen(port, '0.0.0.0');

  console.log(`Server running on http://localhost:${port}`);
};

void bootstrap();
