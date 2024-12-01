import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'logradouro' })
  street: string;

  @Column({ name: 'localidade' })
  city: string;

  @Column({ name: 'uf' })
  state: string;

  @Column({ name: 'cep' })
  zipCode: string;

  @Column({ name: 'pais', default: 'Brasil' })  // País padrão Brasil
  country: string;

  @Column({ name: 'numero' })
  number: string;

  @Column({ name: 'complemento', nullable: true })
  complement?: string;
}
