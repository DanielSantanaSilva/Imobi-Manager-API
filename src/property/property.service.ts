import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { Constructor } from '../entities/constructor.entity';
import { CreatePropertyDto } from '../dtos/create-property.dto';
import { FilterPropertyDto } from 'src/dtos/filter-property-dto';
import { AddressService } from '../address/address.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    private readonly addressService: AddressService,
  ) {}

  // Função para criar uma nova propriedade
  async create(createPropertyData: CreatePropertyDto, constructor: Constructor): Promise<Property> {
    const address = await this.addressService.save(createPropertyData.address);
    
    if (!address) {
      throw new BadRequestException('Erro ao salvar endereço');
    }
  
    // Cria a propriedade e associa ao endereço e à construtora
    const property = new Property();
    property.name = createPropertyData.name;
    property.price = createPropertyData.price;
    property.bedrooms = createPropertyData.bedrooms;
    property.bathrooms = createPropertyData.bathrooms;
    property.description = createPropertyData.description;
    property.propertyConstructor = constructor;
    property.address = address;
    
    // Salva a propriedade no banco de dados
    return this.propertyRepository.save(property);
  }
  

  // Função para atualizar uma propriedade existente
  async update(id: number, data: CreatePropertyDto, constructor: Constructor): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Propriedade não encontrada');
    }

    // Atualiza os dados da propriedade
    Object.assign(property, {
      name: data.name,
      price: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      description: data.description || property.description,
      propertyConstructor: constructor,
    });

    // Se um endereço for fornecido, salva ou atualiza o endereço
    if (data.address) {
      const address = await this.addressService.save(data.address);
      property.address = address;
    }

    // Salva a propriedade atualizada no banco de dados
    return this.propertyRepository.save(property);
  }

  // Função para buscar todas as propriedades com filtros
  async findAll(filter: FilterPropertyDto): Promise<Property[]> {
    const queryBuilder = this.propertyRepository.createQueryBuilder('property');
  
    // Aplica os filtros de preço, quartos e banheiros se estiverem presentes
    if (filter.priceMin) {
      queryBuilder.andWhere('property.price >= :priceMin', { priceMin: filter.priceMin });
    }
  
    if (filter.priceMax) {
      queryBuilder.andWhere('property.price <= :priceMax', { priceMax: filter.priceMax });
    }
  
    if (filter.bedrooms) {
      queryBuilder.andWhere('property.bedrooms = :bedrooms', { bedrooms: filter.bedrooms });
    }
  
    if (filter.bathrooms) {
      queryBuilder.andWhere('property.bathrooms = :bathrooms', { bathrooms: filter.bathrooms });
    }
  
    return queryBuilder.getMany();
  }
  

  // Função para buscar uma propriedade pelo ID
  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Propriedade não encontrada');
    }
    return property;
  }

  // Função para remover uma propriedade
  async remove(id: number): Promise<{ message: string }> {
    const property = await this.propertyRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException('Propriedade não encontrada');
    }

    await this.propertyRepository.remove(property);
    return { message: 'Propriedade removida com sucesso' };
  }

}
