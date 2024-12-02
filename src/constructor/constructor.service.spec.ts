import { Test, TestingModule } from '@nestjs/testing';
import { ConstructorService } from './constructor.service';
import { Repository } from 'typeorm';
import { Constructor } from '../entities/constructor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ConstructorService', () => {
  let service: ConstructorService;
  let repository: Repository<Constructor>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConstructorService,
        { provide: getRepositoryToken(Constructor), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ConstructorService>(ConstructorService);
    repository = module.get<Repository<Constructor>>(getRepositoryToken(Constructor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConstructor', () => {
    it('should create and save a new constructor', async () => {
      const name = 'Test Constructor';
      const constructorEntity = { id: 1, name };
      mockRepository.create.mockReturnValue(constructorEntity);
      mockRepository.save.mockResolvedValue(constructorEntity);

      const result = await service.createConstructor(name);

      expect(repository.create).toHaveBeenCalledWith({ name });
      expect(repository.save).toHaveBeenCalledWith(constructorEntity);
      expect(result).toEqual(constructorEntity);
    });
  });

  describe('listConstructors', () => {
    it('should return all constructors', async () => {
      const constructors = [{ id: 1, name: 'Constructor 1' }, { id: 2, name: 'Constructor 2' }];
      mockRepository.find.mockResolvedValue(constructors);

      const result = await service.listConstructors();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(constructors);
    });
  });

  describe('deleteConstructor', () => {
    it('should remove a constructor if it exists', async () => {
      const constructor = { id: 1, name: 'Test Constructor' };
      mockRepository.findOne.mockResolvedValue(constructor);
      mockRepository.remove.mockResolvedValue(constructor);

      const result = await service.deleteConstructor(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(constructor);
      expect(result).toEqual({ message: 'Contrutora removida com sucesso' });
    });

    it('should throw NotFoundException if constructor does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteConstructor(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateConstructor', () => {
    it('should update and save the constructor', async () => {
      const constructor = { id: 1, name: 'Old Name' };
      const updatedConstructor = { id: 1, name: 'New Name', createdAt: new Date(), properties: [] };
      mockRepository.save.mockResolvedValue(updatedConstructor);

      const result = await service.updateConstructor(updatedConstructor);

      expect(repository.save).toHaveBeenCalledWith(updatedConstructor);
      expect(result).toEqual(updatedConstructor);
    });
  });

  describe('findOne', () => {
    it('should return the constructor if it exists', async () => {
      const constructor = { id: 1, name: 'Test Constructor' };
      mockRepository.findOne.mockResolvedValue(constructor);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(constructor);
    });

    it('should throw NotFoundException if constructor does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
