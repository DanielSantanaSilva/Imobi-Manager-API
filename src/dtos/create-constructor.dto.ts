import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para criar uma nova construtora.
 */
export class CreateConstructorDto {
  @IsNotEmpty({ message: 'O nome da construtora é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  name: string; // Alinhado com o nome da propriedade na entidade Constructor
}
