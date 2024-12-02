import { Test, TestingModule } from '@nestjs/testing';
import { ConstructorController } from './constructor.controller';
import { ConstructorService } from './constructor.service';
import { NotFoundException } from '@nestjs/common';

describe('ConstructorController', () => {
  let controller: ConstructorController;
  let service: ConstructorService;

  const mockConstructorService = {
    createConstructor: jest.fn(),
    listConstructors: jest.fn(),
    findOne: jest.fn(),
    deleteConstructor: jest.fn(),
    updateConstructor: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstructorController],
      providers: [{ provide: ConstructorService, useValue: mockConstructorService }],
    }).compile();

    controller = module.get<ConstructorController>(ConstructorController);
    service = module.get<ConstructorService>(ConstructorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createConstructor', () => {
    it('should call the service with correct parameters', async () => {
      const dto = { name: 'Test Constructor' };
      mockConstructorService.createConstructor.mockResolvedValue({ id: 1, name: 'Test Constructor' });

      const result = await controller.createConstructor(dto);

      expect(service.createConstructor).toHaveBeenCalledWith('Test Constructor');
      expect(result).toEqual({ id: 1, name: 'Test Constructor' });
    });
  });

  describe('listConstructors', () => {
    it('should return a list of constructors', async () => {
      const constructors = [{ id: 1, name: 'Test Constructor' }];
      mockConstructorService.listConstructors.mockResolvedValue(constructors);

      const result = await controller.listConstructors();

      expect(service.listConstructors).toHaveBeenCalled();
      expect(result).toEqual(constructors);
    });
  });

  describe('getConstructorById', () => {
    it('should return a constructor if found', async () => {
      const constructor = { id: 1, name: 'Test Constructor' };
      mockConstructorService.findOne.mockResolvedValue(constructor);

      const result = await controller.getConstructorById(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(constructor);
    });

    it('should throw NotFoundException if constructor is not found', async () => {
      mockConstructorService.findOne.mockResolvedValue(null);

      await expect(controller.getConstructorById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteConstructor', () => {
    it('should call the service with the correct id', async () => {
      mockConstructorService.deleteConstructor.mockResolvedValue({ success: true });

      const result = await controller.deleteConstructor(1);

      expect(service.deleteConstructor).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateConstructor', () => {
    it('should update and return the updated constructor', async () => {
      const constructor = { id: 1, name: 'Old Name' };
      const updatedConstructor = { id: 1, name: 'New Name' };
      mockConstructorService.findOne.mockResolvedValue(constructor);
      mockConstructorService.updateConstructor.mockResolvedValue(updatedConstructor);

      const result = await controller.updateConstructor(1, { name: 'New Name' });

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.updateConstructor).toHaveBeenCalledWith({ id: 1, name: 'New Name' });
      expect(result).toEqual(updatedConstructor);
    });

    it('should throw NotFoundException if constructor is not found', async () => {
      mockConstructorService.findOne.mockResolvedValue(null);

      await expect(controller.updateConstructor(1, { name: 'New Name' })).rejects.toThrow(NotFoundException);
    });
  });
});
