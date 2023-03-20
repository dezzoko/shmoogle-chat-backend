import { IGenericRepository } from '../abstracts/generic-repository.abstract';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository extends IGenericRepository<UserEntity> {
  getByLogin(login: string): Promise<UserEntity>;
  getKnownUsers(userId: string): Promise<UserEntity[]>;
  registerUser(data: RegisterData): Promise<UserEntity>;
  updatePassword(userId: string, data: UpdatePasswordData): Promise<UserEntity>;
  updateAvatar(userId: string, avatarUrl: string): Promise<UserEntity>;
}

interface RegisterData {
  login: string;
  password: string;
}
interface UpdatePasswordData {
  password: string;
  newPassword: string;
}
