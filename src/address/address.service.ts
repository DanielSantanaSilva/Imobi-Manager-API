import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from 'src/dtos/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly httpService: HttpService
  ) {}

  // Função para buscar o endereço pelo CEP
  async getAddressByZipCode(zipCode: string): Promise<CreateAddressDto> {
    try {
      const response: { data: any } = await lastValueFrom(
        this.httpService.get(`https://viacep.com.br/ws/${zipCode}/json/`)
      );
  
      const address = response.data;
  
      if (!address || address.erro) {
        throw new Error('Endereço não encontrado para o CEP informado.');
      }
  
      // Garantir que os campos essenciais existem, se não, use valores padrão
      const addressDto: CreateAddressDto = {
        street: address.logradouro?.trim() || 'Rua não especificada',
        city: address.localidade?.trim() || 'Cidade não especificada',
        state: address.uf?.trim() || 'Estado não especificado',
        zipCode: zipCode,
        country: 'Brasil',
        number: '',
        complement: '',
      };
  
      return addressDto;
    } catch (error) {
      console.error('Erro ao buscar endereço:', error.message);
      throw new Error('Erro ao buscar o endereço. Verifique o CEP informado.');
    }
  }


  async remove(id: number): Promise<void> {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (address) {
      await this.addressRepository.remove(address);
    }
  }
  

  // Função para salvar o endereço no banco de dados
  async save(address: CreateAddressDto): Promise<Address> {
    if (!address.street || address.street.trim() === '') {
      console.error('Erro: "street" está vazio ou indefinido');
      throw new Error('O campo "street" é obrigatório.');
    }
  
    // Criar a entidade Address a partir do DTO
    const addressEntity = this.addressRepository.create({
      ...address,
      number: address.number || '', 
      complement: address.complement || '',
    });
  
  
    // Salvar no banco e retornar a entidade com o id gerado
    return this.addressRepository.save(addressEntity);
  }
}
