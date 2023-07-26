import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('gen')
  create() {
    return this.devicesService.create();
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Post('codes')
  findOne(@Body() device: CreateDeviceDto) {
    return this.devicesService.getCode(device);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.devicesService.delete(+id);
  }
}
