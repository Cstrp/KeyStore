import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { StorageModule } from './storage';
import { AppService } from './app.service';
import { EventsModule } from './events';
import { auth } from './config/auth';
import {
  DeliveryModule,
  HealthModule,
  OrdersModule,
  PaymentsModule,
  ProductsModule,
} from './modules';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({ global: true }),
    PaymentsModule,
    ProductsModule,
    DeliveryModule,
    StorageModule,
    OrdersModule,
    HealthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
