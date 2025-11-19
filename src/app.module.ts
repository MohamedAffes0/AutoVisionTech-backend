import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarEntity } from './modules/car/car.entity';
import { CarModule } from './modules/car/car.module';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { CommentEntity } from './modules/comment/comment.entity';
import { CommentModule } from './modules/comment/comment.module';
import { ReservationEntity } from './modules/reservation/reservation.entity';
import { ReservationModule } from './modules/reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [CarEntity, User, CommentEntity, ReservationEntity],
      synchronize: true,
    }), // Database configuration
    CarModule,
    UserModule,
    CommentModule,
    ReservationModule,
    AuthModule.forRoot({
      auth,
      isGlobal: true, // Make auth module global
      disableGlobalAuthGuard: true, // Disable default global auth guard
    }), // Configure better-auth with the auth instance
  ],
  providers: [AppService],
  controllers: [AppController], // Import the AppController
})
export class AppModule {}
