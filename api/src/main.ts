import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    const swaggerConfig = new DocumentBuilder()
    .setTitle('Boilplate')
    .setDescription('boilplate')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json'
  });
  
  await app.listen(3000);
}
bootstrap();
