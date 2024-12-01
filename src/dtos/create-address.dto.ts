import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO para criar um novo endereço.
 */
export class CreateAddressDto {
  @IsNotEmpty({ message: 'A rua é obrigatória.' })
  @IsString({ message: 'A rua deve ser uma string.' })
  street: string;  // 'logradouro'

  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  city: string;  // 'localidade'

  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  state: string;  // 'uf'

  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  zipCode: string;  // 'cep'

  @IsNotEmpty({ message: 'O país é obrigatório.' })
  @IsString({ message: 'O país deve ser uma string.' })
  country: string;

  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @IsString({ message: 'O número deve ser uma string.' })
  number: string;

  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @Transform(({ value }) => (value === undefined || value === null ? '' : value))
  complement?: string;  // 'complemento'
}
