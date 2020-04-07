import { Utilisateur } from './utilisateur';
import { Zone } from './zone';
import { Team } from './team';

export class MesTeams {
    Id: number;
    Utilisateur: Utilisateur;
    Zone: Zone;
    Team: Team;
    NomTeam : string;
    Actif: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Utilisateur = attachment.Utilisateur;
      this.Zone = attachment.Zone;
      this.Team = attachment.Team;
      this.Actif = attachment.Actif;
    }
}
