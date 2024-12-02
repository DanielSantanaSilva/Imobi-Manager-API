import { Controller, Post, Body, Get, Param, Delete, Query, Put } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from '../dtos/create-property.dto';
import { ConstructorService } from '../constructor/constructor.service';
import { NotFoundException } from '@nestjs/common';
import { FilterPropertyDto } from '../dtos/filter-property-dto';
import { AddressService } from '../address/address.service';
import { Property } from 'src/entities/property.entity';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly constructorService: ConstructorService,
    private readonly addressService: AddressService,
  ) {}

  
  // Endpoint para criar uma propriedade com a associação à construtora
  @Post()
  async createProperty(@Body() createPropertyData: CreatePropertyDto): Promise<Property> {
    const constructor = await this.constructorService.findOne(createPropertyData.constructorId);
    if (!constructor) {
      throw new NotFoundException('Construtora não encontrada');
    }

    // Buscar e salvar o endereço
    const addressData = await this.addressService.getAddressByZipCode(createPropertyData.address.zipCode);
    const savedAddress = await this.addressService.save({
      ...addressData,
      number: createPropertyData.address.number || '',
      complement: createPropertyData.address.complement || '',
    });

    // Criar a propriedade diretamente no serviço
    return this.propertyService.create(
      { ...createPropertyData, address: savedAddress },
      constructor
    );
  }

 

  // Endpoint para listar todas as propriedades com filtros
  @Get()
  async listProperties(@Query() filter: FilterPropertyDto) {
    return this.propertyService.findAll(filter); 
  }

  // Endpoint para excluir uma propriedade
  @Delete(':id')
  async deleteProperty(@Param('id') id: number) {
    return this.propertyService.remove(id);
  }

  // Endpoint para listar uma propriedade específica
  @Get(':id')
  async getProperty(@Param('id') id: number) {
    return this.propertyService.findOne(id); // O próprio serviço lida com a exceção
  }

  // Endpoint para atualizar uma propriedade
  @Put(':id')
  async updateProperty(@Param('id') id: number, @Body() data: CreatePropertyDto) {
    // Verificar a existência da construtora
    const constructor = await this.constructorService.findOne(data.constructorId);
    if (!constructor) {
      throw new NotFoundException('Construtora não encontrada');
    }

    // Atualizar a propriedade com o novo conjunto de dados
    return this.propertyService.update(id, data, constructor);
  }

}
