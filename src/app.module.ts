import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './devices/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Device],
      synchronize: true,
    }),
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
