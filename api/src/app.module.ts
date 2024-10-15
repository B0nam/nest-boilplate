import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${env.NODE_ENV}`
    }),
    MongooseModule.forRoot(
      `mongodb://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
