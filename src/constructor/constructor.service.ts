import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constructor } from '../entities/constructor.entity';

@Injectable()
export class ConstructorService {
  [x: string]: any;
  findById(constructorId: number): import("typeorm").DeepPartial<Constructor> | PromiseLike<import("typeorm").DeepPartial<Constructor>> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Constructor)
    private constructorRepository: Repository<Constructor>,
  ) {}

  // Criar Construtora
  async createConstructor(nome: string): Promise<Constructor> {
    const newConstructor = this.constructorRepository.create({ name: nome });
    return this.constructorRepository.save(newConstructor);
  }

  // Listar Construtoras
  async listConstructors(): Promise<Constructor[]> {
    return this.constructorRepository.find();
  }

  // Excluir Construtora
  async deleteConstructor(id: number): Promise<{ message: string }> {
    const constructor = await this.constructorRepository.findOne({ where: { id } });
    if (!constructor) {
      throw new NotFoundException('Constructor not found');
    }
    await this.constructorRepository.remove(constructor);
    return { message: 'Contrutora removida com sucesso' };
  }


  // Atualizar Construtora
  async updateConstructor(constructor: Constructor): Promise<Constructor> {
    return this.constructorRepository.save(constructor);
  }

  // Encontrar Construtora por ID
  async findOne(id: number): Promise<Constructor> {
    const constructor = await this.constructorRepository.findOne({ where: { id } });
    if (!constructor) {
      throw new NotFoundException('Constructor not found');
    }
    return constructor;
  }
}
