import { Test, TestingModule } from '@nestjs/testing';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { ConstructorService } from '../constructor/constructor.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from '../dtos/create-property.dto';
import { FilterPropertyDto } from '../dtos/filter-property-dto';
import { AddressService } from '../address/address.service';

describe('PropertyController', () => {
  let controller: PropertyController;
  let propertyService: PropertyService;
  let constructorService: ConstructorService;
  let addressService: AddressService;

  const mockPropertyService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockConstructorService = {
    findOne: jest.fn(),
  };

  const mockAddressService = {
    getAddressByZipCode: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: ConstructorService, useValue: mockConstructorService },
        { provide: AddressService, useValue: mockAddressService },
      ],
    }).compile();

    controller = module.get<PropertyController>(PropertyController);
    propertyService = module.get<PropertyService>(PropertyService);
    constructorService = module.get<ConstructorService>(ConstructorService);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProperty', () => {
    it('should create a property successfully', async () => {
      const constructor = { id: 1, name: 'Constructor 1' };
      const address = {
        id: 1,
        zipCode: '08255-210',
          number: '123',
          complement: '',
          street: 'Main Street',
          city: 'City',
          state: 'SP',
          country: 'Brazil',
      };

      const propertyData: CreatePropertyDto = {
        name: 'Propriedade A',
        price: 500000,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Uma propriedade bem localizada com várias opções de lazer.',
        constructorId: 1,
        address: {
          zipCode: '08255-210',
          number: '123',
          complement: '',
          street: 'Main Street',
          city: 'City',
          state: 'SP',
          country: 'Brazil',
        },
      };

      const property = { id: 1, ...propertyData, address };

      mockConstructorService.findOne.mockResolvedValue(constructor);
      mockAddressService.getAddressByZipCode.mockResolvedValue(address);
      mockAddressService.save.mockResolvedValue(address);
      mockPropertyService.create.mockResolvedValue(property);

      const result = await controller.createProperty(propertyData);

      expect(constructorService.findOne).toHaveBeenCalledWith(propertyData.constructorId);
      expect(addressService.getAddressByZipCode).toHaveBeenCalledWith(propertyData.address.zipCode);
      expect(addressService.save).toHaveBeenCalledWith(expect.objectContaining(address));
      expect(propertyService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          address: expect.objectContaining({
            city: "City",
            complement: "",
            country: "Brazil",
            id: expect.any(Number),
            number: "123",
            state: "SP",
            street: "Main Street",
            zipCode: "08255-210",
          }),
          bathrooms: 2,
          bedrooms: 3,
          constructorId: 1,
          description: "Uma propriedade bem localizada com várias opções de lazer.",
          name: "Propriedade A",
          price: 500000,
        }),
        { id: 1, name: 'Constructor 1' }
      );
      
      expect(result).toEqual(property);
    });

    it('should throw NotFoundException if constructor does not exist', async () => {
      mockConstructorService.findOne.mockResolvedValue(null);

      const propertyData: CreatePropertyDto = {
        name: 'Test Property',
        price: 100000,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Test Description',
        constructorId: 1,
        address: {
          zipCode: '12345',
          number: '123',
          complement: '',
          street: '',
          city: '',
          state: '',
          country: '',
        },
      };

      await expect(controller.createProperty(propertyData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('listProperties', () => {
    it('should return a list of properties with filters', async () => {
      const filter: FilterPropertyDto = {
        priceMin: 100000,
        priceMax: 500000,
        bedrooms: 3,
        bathrooms: 2,
      };

      const properties = [
        { id: 1, name: 'Property 1', price: 150000, bedrooms: 3, bathrooms: 2 },
        { id: 2, name: 'Property 2', price: 300000, bedrooms: 4, bathrooms: 3 },
      ];

      mockPropertyService.findAll.mockResolvedValue(properties);

      const result = await controller.listProperties(filter);

      expect(propertyService.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(properties);
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property successfully', async () => {
      mockPropertyService.remove.mockResolvedValue({ message: 'Property removed successfully' });

      const result = await controller.deleteProperty(1);

      expect(propertyService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Property removed successfully' });
    });
  });

  describe('getProperty', () => {
    it('should return a specific property by ID', async () => {
      const property = { id: 1, name: 'Property 1' };
      mockPropertyService.findOne.mockResolvedValue(property);

      const result = await controller.getProperty(1);

      expect(propertyService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(property);
    });
  });

  describe('updateProperty', () => {
    it('should update a property successfully', async () => {
      const constructor = { id: 1, name: 'Constructor 1' };
      const propertyData: CreatePropertyDto = {
        name: 'Updated Property',
        price: 200000,
        bedrooms: 4,
        bathrooms: 3,
        description: 'Updated Description',
        constructorId: 1,
        address: {
          zipCode: '54321',
          number: '456',
          complement: '',
          street: '',
          city: '',
          state: '',
          country: '',
        },
      };
      const updatedProperty = { id: 1, ...propertyData };

      mockConstructorService.findOne.mockResolvedValue(constructor);
      mockPropertyService.update.mockResolvedValue(updatedProperty);

      const result = await controller.updateProperty(1, propertyData);

      expect(constructorService.findOne).toHaveBeenCalledWith(propertyData.constructorId);
      expect(propertyService.update).toHaveBeenCalledWith(1, propertyData, constructor);
      expect(result).toEqual(updatedProperty);
    });

    it('should throw NotFoundException if constructor does not exist', async () => {
      mockConstructorService.findOne.mockResolvedValue(null);

      const propertyData: CreatePropertyDto = {
        name: 'Updated Property',
        price: 200000,
        bedrooms: 4,
        bathrooms: 3,
        description: 'Updated Description',
        constructorId: 1,
        address: {
          zipCode: '54321',
          number: '456',
          complement: '',
          street: '',
          city: '',
          state: '',
          country: '',
        },
      };

      await expect(controller.updateProperty(1, propertyData)).rejects.toThrow(NotFoundException);
    });
  });
});
