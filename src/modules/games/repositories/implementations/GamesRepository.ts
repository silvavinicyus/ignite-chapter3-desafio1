import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {    
    return this.repository
      .createQueryBuilder("game")
      .where("game.title ilike :param", {param: `%${param}%`})
      .getMany();        
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(1) from games"); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder("game")
      .innerJoinAndSelect("game.users", "user")
      .where("game.id = :id", {id})
      .getOneOrFail();

      return games.users;
  }
}
