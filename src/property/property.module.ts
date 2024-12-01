import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property } from '../entities/property.entity';
import { AddressService } from '../address/address.service';
import { ConstructorModule } from '../constructor/constructor.module';
import { HttpModule } from '@nestjs/axios';
import { Address } from 'src/entities/address.entity';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, Address]), 
    ConstructorModule,
    HttpModule,
    AddressModule,
  ],
  providers: [PropertyService, AddressService],
  controllers: [PropertyController],
})
export class PropertyModule {}
