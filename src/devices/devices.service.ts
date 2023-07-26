import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';

@Injectable()
export class DevicesService {
  private readonly lengthCode = 8;
  private readonly nbCodes = 6;
  constructor(
    @InjectRepository(Device)
    private readonly DeviceRepository: Repository<Device>,
  ) {}

  private createOneCode(lengthCode: number): string {
    const digits =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const nbDigits = digits.length;
    let code = '';
    for (let i = 0; i < lengthCode; i++) {
      const randomIndex = Math.floor(Math.random() * nbDigits);
      code += digits.charAt(randomIndex);
    }
    return code;
  }

  private generateAllCodes(nb: number, lengthCode: number): string {
    let codes = '';
    for (let i = 0; i < nb; i++) {
      codes += this.createOneCode(lengthCode);
    }
    return codes;
  }

  private formatCode(codes: string, start = 0): string {
    return codes.slice(start, this.lengthCode + start);
  }

  async create(): Promise<CreateDeviceDto> {
    const codes = this.generateAllCodes(this.nbCodes, this.lengthCode);
    const newDevice = await this.DeviceRepository.save({ codes, reqCount: 0 });
    const device = {
      id: newDevice.id,
      codes: this.formatCode(newDevice.codes),
    };
    return device;
  }

  async findAll(): Promise<CreateDeviceDto[]> {
    return await this.DeviceRepository.find();
  }

  private isValidCode(codes: string, currentCode: string): boolean {
    return codes === currentCode;
  }

  private reachedNbOfReq(reqCount: number): boolean {
    const nbOfReq = 5;
    return reqCount >= nbOfReq;
  }

  private async resetDevices(
    device: CreateDeviceDto,
  ): Promise<CreateDeviceDto> {
    const updatedDevice = {
      id: device.id,
      codes: this.generateAllCodes(this.nbCodes, this.lengthCode),
      reqCount: 0,
    };
    await this.DeviceRepository.save(updatedDevice);
    const deviceWithNewCode = {
      id: device.id,
      codes: this.formatCode(updatedDevice.codes, 0),
    };
    return deviceWithNewCode;
  }

  private renewPrev(codes: string, left: number, right: number) {
    const updatedCodes =
      codes.slice(0, left) +
      this.createOneCode(this.lengthCode) +
      codes.slice(right);
    return updatedCodes;
  }
  private async findNextCode(
    device: Device,
    start: number,
  ): Promise<CreateDeviceDto> {
    if (this.reachedNbOfReq(device.reqCount)) {
      return this.resetDevices(device);
    }
    const cursor = this.lengthCode + start;
    const newCode = this.formatCode(device.codes, cursor);
    const deviceWithNewCode = { id: device.id, codes: newCode };
    const updatedCodes = this.renewPrev(device.codes, start, cursor);
    const updatedDevice = {
      id: device.id,
      codes: updatedCodes,
      reqCount: device.reqCount + 1,
    };
    await this.DeviceRepository.save(updatedDevice);
    return deviceWithNewCode;
  }
  async getCode(device: CreateDeviceDto) {
    const matchedDevice = await this.DeviceRepository.findOne({
      where: { id: device.id },
    });
    // start is the beginning of the current code in the whole codes
    const start = matchedDevice.reqCount * this.lengthCode;
    const currentCode = this.formatCode(matchedDevice.codes, start);
    if (this.isValidCode(device.codes, currentCode)) {
      return this.findNextCode(matchedDevice, start);
    }
    throw Error('Une erreur est survenue lors de la demande du code');
  }

  async delete(id: number) {
    const device = await this.DeviceRepository.findOne({ where: { id } });
    return await this.DeviceRepository.remove(device);
  }
}
