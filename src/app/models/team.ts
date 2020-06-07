import { User } from './user';
import { Zone } from './zone';
import { CharactersConfiguration } from './characters-configuration';

export class Team {
    Id: number;
    User: User;
    Zone: Zone;
    CharactersConfiguration: CharactersConfiguration;
    TeamName : string;
    Active: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.User = attachment.User;
      this.Zone = attachment.Zone;
      this.CharactersConfiguration = attachment.CharactersConfiguration;
      this.TeamName = attachment.TeamName;
      this.Active = attachment.Active;
    }
}
