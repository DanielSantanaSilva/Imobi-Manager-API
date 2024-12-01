import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from 'src/entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([Address])],
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressModule {}