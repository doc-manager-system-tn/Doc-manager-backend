import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3001',] ,// Autorise uniquement le frontend React
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],      // Autorise ces méthodes
    credentials: true,
  
  });
  await app.listen(3003);

}
bootstrap();
