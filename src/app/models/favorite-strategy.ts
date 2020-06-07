import { User } from './user';
import { Strategy } from './strategy';

export class FavoriteStrategy {
    Id: number;
    User: User;
    Strategy: Strategy;
    Active: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.User = attachment.User;
      this.Strategy = attachment.Strategy;
      this.Active = attachment.Active;
    }
}