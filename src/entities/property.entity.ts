import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Constructor } from './constructor.entity';
import { Attachment } from './attachment.entity';
import { Address } from './address.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => Constructor, (constructor) => constructor.properties)
  @JoinColumn({ name: 'constructor_id' })
  propertyConstructor: Constructor;

  @Column({ type: 'decimal', nullable: false })
  price: number;
  
  @Column({ type: 'int', nullable: false })
  bedrooms: number;

  @Column({ type: 'int', nullable: false })
  bathrooms: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Attachment, (attachment) => attachment.property, { cascade: true })
  attachments: Attachment[];

  @OneToOne(() => Address, { eager: true, nullable: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
