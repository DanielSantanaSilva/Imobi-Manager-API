import { Controller, Post, Body, Get, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { ConstructorService } from './constructor.service';
import { CreateConstructorDto } from '../dtos/create-constructor.dto';

@Controller('constructors')
export class ConstructorController {
  constructor(private readonly constructorService: ConstructorService) {}

  // Endpoint para criar uma construtora
  @Post()
  async createConstructor(@Body() data: CreateConstructorDto) {
    return this.constructorService.createConstructor(data.name);
  }

  // Endpoint para listar todas as construtoras
  @Get()
  async listConstructors() {
    return this.constructorService.listConstructors();
  }

  // Endpoint para buscar uma construtora por ID
  @Get(':id')
  async getConstructorById(@Param('id') id: number) {
    const constructor = await this.constructorService.findOne(id);
    if (!constructor) {
      throw new NotFoundException('Constructor not found');
    }
    return constructor;
  }

  // Endpoint para excluir uma construtora
  @Delete(':id')
  async deleteConstructor(@Param('id') id: number) {
    return this.constructorService.deleteConstructor(id);
  }

  // Endpoint para atualizar uma construtora
  @Put(':id')
  async updateConstructor(@Param('id') id: number, @Body() data: CreateConstructorDto) {
    const constructor = await this.constructorService.findOne(id);
    if (!constructor) {
      throw new NotFoundException('Constructor not found');
    }

    // Atualizando o nome da construtora
    constructor.name = data.name;

    // Chama o método de atualização (ou persistência)
    return this.constructorService.updateConstructor(constructor);
  }
}
