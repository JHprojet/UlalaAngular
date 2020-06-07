import { User } from './user';
import { BossesPerZone } from './bosses-per-zone';
import { CharactersConfiguration } from './characters-configuration';

export class Strategy {
    Id: number;
    User: User;
    BossZone: BossesPerZone;
    CharactersConfiguration: CharactersConfiguration;
    ImagePath1 : string;
    ImagePath2 : string;
    ImagePath3 : string;
    ImagePath4 : string;
    Note: number;
    Active: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.User = attachment.User;
      this.BossZone = attachment.BossZone;
      this.CharactersConfiguration = attachment.CharactersConfiguration;
      this.ImagePath1 = attachment.ImagePath1;
      this.ImagePath2 = attachment.ImagePath2;
      this.ImagePath3 = attachment.ImagePath3;
      this.ImagePath4 = attachment.ImagePath4;
      this.Note = attachment.Note;
      this.Active = attachment.Active;
    }
}