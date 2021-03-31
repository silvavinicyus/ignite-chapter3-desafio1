import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return this.repository.findOneOrFail({
      where: {
        id: user_id
      },
      relations: ['games']
    }
    )
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("select first_name from users order by first_name ASC"); 
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {

    first_name = first_name.toLowerCase();
    last_name = last_name.toLowerCase();

    return this.repository.query("select * from users where lower(first_name) = $1 AND lower(last_name) = $2", [first_name, last_name]); // Complete usando raw query
  }
}
