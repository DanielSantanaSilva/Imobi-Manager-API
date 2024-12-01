import { Constructor } from 'src/entities/constructor.entity';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Constructor)
export class ConstructorRepository extends Repository<Constructor> {}
