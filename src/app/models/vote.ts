import { User } from './user';
import { Strategy } from './strategy';

export class Vote {
    Id: number;
    User: User;
    Strategy: Strategy;
    Vote: number;
    Active: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.User = attachment.User;
      this.Strategy = attachment.Strategy;
      this.Vote = attachment.Vote;
      this.Active = attachment.Active;
    }
}