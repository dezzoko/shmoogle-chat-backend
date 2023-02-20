import { IGenericRepository } from '../abstracts/generic-repository.abstract';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository extends IGenericRepository<UserEntity> {
  getByLogin(login: string): Promise<UserEntity>;
  registerUser(data: RegisterData): Promise<UserEntity>;
}

interface RegisterData {
  login: string;
  password: string;
}
