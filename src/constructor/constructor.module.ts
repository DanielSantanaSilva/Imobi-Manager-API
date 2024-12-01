import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructorService } from './constructor.service';
import { ConstructorController } from './constructor.controller';
import { Constructor } from '../entities/constructor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Constructor])],
  controllers: [ConstructorController],
  providers: [ConstructorService],
  exports: [ConstructorService],
})
export class ConstructorModule {}
