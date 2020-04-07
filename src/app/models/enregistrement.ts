import { Utilisateur } from './utilisateur';
import { BossZone } from './boss-zone';
import { Team } from './team';

export class Enregistrement {
    Id: number;
    Utilisateur: Utilisateur;
    BossZone: BossZone;
    Team: Team;
    ImagePath1 : string;
    ImagePath2 : string;
    ImagePath3 : string;
    ImagePath4 : string;
    Note: number;
    Actif: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Utilisateur = attachment.Utilisateur;
      this.BossZone = attachment.BossZone;
      this.Team = attachment.Team;
      this.ImagePath1 = attachment.ImagePath1;
      this.ImagePath2 = attachment.ImagePath2;
      this.ImagePath3 = attachment.ImagePath3;
      this.ImagePath4 = attachment.ImagePath4;
      this.Note = attachment.Note;
      this.Actif = attachment.Actif;
    }
}