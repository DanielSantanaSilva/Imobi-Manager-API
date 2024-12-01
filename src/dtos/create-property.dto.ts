import { IsNotEmpty, IsNumber, IsOptional, IsPositive, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';
import { AttachmentDto } from './attachment-dto';

/**
 * DTO para criar uma nova propriedade.
 */
export class CreatePropertyDto {
  @IsNotEmpty({ message: 'O nome da propriedade é obrigatório.' })
  @IsString({ message: 'O nome da propriedade deve ser uma string.' })
  name: string;

  @IsNotEmpty({ message: 'O preço da propriedade é obrigatório.' })
  @IsNumber({}, { message: 'O preço da propriedade deve ser um número.' })
  @IsPositive({ message: 'O preço da propriedade deve ser positivo.' })
  price: number;

  @IsNotEmpty({ message: 'O número de quartos é obrigatório.' })
  @IsNumber({}, { message: 'O número de quartos deve ser um número.' })
  bedrooms: number;

  @IsNotEmpty({ message: 'O número de banheiros é obrigatório.' })
  @IsNumber({}, { message: 'O número de banheiros deve ser um número.' })
  bathrooms: number;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @ValidateNested({ message: 'O endereço deve ser válido.' })
  @Type(() => CreateAddressDto)
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  address: CreateAddressDto;

  @ValidateNested({ each: true, message: 'Os anexos devem ser válidos.' })
  @Type(() => AttachmentDto)
  @IsOptional()
  attachments?: AttachmentDto[];

  @IsNotEmpty({ message: 'O ID da construtora é obrigatório.' })
  @IsNumber({}, { message: 'O ID da construtora deve ser um número.' })
  @IsPositive({ message: 'O ID da construtora deve ser positivo.' })
  constructorId: number;
}
