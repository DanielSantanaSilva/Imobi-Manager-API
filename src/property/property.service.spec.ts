import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService } from './property.service';
import { AddressService } from '../address/address.service';
import { Property } from '../entities/property.entity';
import { Constructor } from '../entities/constructor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from '../dtos/create-property.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Address } from '../entities/address.entity';

describe('PropertyService', () => {
  let service: PropertyService;
  let propertyRepository: Repository<Property>;
  let addressService: AddressService;

  const mockPropertyRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockAddressService = {
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockConstructor = { id: 1, name: 'Test Constructor' } as Constructor;

  const mockAddress: Address = {
    id: 1,
    street: 'Rua Teste',
    city: 'Cidade Teste',
    state: 'Estado Teste',
    zipCode: '12345-678',
    country: 'Brasil',
    number: '123',
    complement: 'Apartamento 1',
  };

  const mockCreatePropertyDto: CreatePropertyDto = {
    name: 'Test Property',
    price: 100000,
    bedrooms: 3,
    bathrooms: 2,
    description: 'A beautiful property',
    address: mockAddress,
    constructorId: 1,
  };

  const createMockProperty = (): Property => ({
    id: 1,
    name: mockCreatePropertyDto.name,
    price: mockCreatePropertyDto.price,
    bedrooms: mockCreatePropertyDto.bedrooms,
    bathrooms: mockCreatePropertyDto.bathrooms,
    description: mockCreatePropertyDto.description,
    address: mockAddress,
    attachments: [],
    propertyConstructor: mockConstructor,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertyRepository,
        },
        {
          provide: AddressService,
          useValue: mockAddressService,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    propertyRepository = module.get<Repository<Property>>(getRepositoryToken(Property));
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new property', async () => {
      mockAddressService.save.mockResolvedValueOnce(mockAddress);
      mockPropertyRepository.save.mockResolvedValueOnce(new Property());

      const result = await service.create(mockCreatePropertyDto, mockConstructor);

      expect(result).toBeInstanceOf(Property);
      expect(mockAddressService.save).toHaveBeenCalledWith(mockCreatePropertyDto.address);
      expect(mockPropertyRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: mockCreatePropertyDto.name,
          propertyConstructor: mockConstructor,
        }),
      );
    });

    it('should throw a BadRequestException if address saving fails', async () => {
      mockAddressService.save.mockResolvedValueOnce(null);

      await expect(service.create(mockCreatePropertyDto, mockConstructor)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should successfully update an existing property', async () => {
      const mockExistingProperty = createMockProperty();
      mockPropertyRepository.findOne.mockResolvedValueOnce(mockExistingProperty);
      mockAddressService.save.mockResolvedValueOnce(mockAddress);
      mockPropertyRepository.save.mockResolvedValueOnce(mockExistingProperty);

      const result = await service.update(1, mockCreatePropertyDto, mockConstructor);

      expect(result).toEqual(mockExistingProperty);
      expect(mockPropertyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPropertyRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if property is not found', async () => {
      mockPropertyRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update(999, mockCreatePropertyDto, mockConstructor)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const properties = [createMockProperty()];
      mockPropertyRepository.createQueryBuilder.mockImplementation(() => ({
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(properties),
      }));

      const result = await service.findAll({ priceMin: 50000 });

      expect(result).toEqual(properties);
      expect(mockPropertyRepository.createQueryBuilder).toHaveBeenCalledWith('property');
    });

    it('should return an empty array if no properties are found', async () => {
      mockPropertyRepository.createQueryBuilder.mockImplementation(() => ({
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      }));

      const result = await service.findAll({ priceMin: 50000 });

      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should successfully remove a property and its associated address', async () => {
      const mockProperty = createMockProperty();
      mockPropertyRepository.findOne.mockResolvedValueOnce(mockProperty);

      const result = await service.remove(1);

      expect(result.message).toBe('Propriedade e endereço associados removidos com sucesso');
      expect(mockAddressService.remove).toHaveBeenCalledWith(mockAddress.id);
      expect(mockPropertyRepository.remove).toHaveBeenCalledWith(mockProperty);
    });

    // Ajuste no teste de remoção
    // Se o método remove espera o ID
    it('should successfully remove a property and its associated address', async () => {
      const mockProperty = {
        id: 1,
        address: mockAddress,  // Garantir que o mockProperty tenha o mockAddress
      } as Property;
      mockPropertyRepository.findOne.mockResolvedValueOnce(mockProperty);

      const result = await service.remove(1);

      expect(result.message).toBe('Propriedade e endereço associados removidos com sucesso');
      expect(mockAddressService.remove).toHaveBeenCalledWith(mockAddress.id); // Espera o ID, não o objeto completo
      expect(mockPropertyRepository.remove).toHaveBeenCalledWith(mockProperty);
    });
  });
});
