import { IsNotEmpty, IsString } from "class-validator";

/**
 * DTO para anexos de propriedades.
 */
export class AttachmentDto {
    @IsNotEmpty({ message: 'O nome do arquivo é obrigatório.' })
    @IsString({ message: 'O nome do arquivo deve ser uma string.' })
    filename: string;
  
    @IsNotEmpty({ message: 'O caminho do arquivo é obrigatório.' })
    @IsString({ message: 'O caminho do arquivo deve ser uma string.' })
    filepath: string;
  }
  