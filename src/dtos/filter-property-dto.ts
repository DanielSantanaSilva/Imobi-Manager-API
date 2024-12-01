import { IsOptional, IsNumber, IsPositive } from "class-validator";


/**
 * DTO para filtrar propriedades.
 */
export class FilterPropertyDto {
    @IsOptional()
    @IsNumber({}, { message: 'O preço mínimo deve ser um número.' })
    @IsPositive({ message: 'O preço mínimo deve ser positivo.' })
    priceMin?: number;
  
    @IsOptional()
    @IsNumber({}, { message: 'O preço máximo deve ser um número.' })
    @IsPositive({ message: 'O preço máximo deve ser positivo.' })
    priceMax?: number;
  
    @IsOptional()
    @IsNumber({}, { message: 'O número de quartos deve ser um número.' })
    @IsPositive({ message: 'O número de quartos deve ser positivo.' })
    bedrooms?: number;
  
    @IsOptional()
    @IsNumber({}, { message: 'O número de banheiros deve ser um número.' })
    @IsPositive({ message: 'O número de banheiros deve ser positivo.' })
    bathrooms?: number;
  }
  