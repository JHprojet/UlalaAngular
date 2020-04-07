import { Utilisateur } from './utilisateur';
import { Enregistrement } from './enregistrement';

export class Vote {
    Id: number;
    Utilisateur: Utilisateur;
    Enregistrement: Enregistrement;
    Vote: number;
    Actif: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Utilisateur = attachment.Utilisateur;
      this.Enregistrement = attachment.Enregistrement;
      this.Vote = attachment.Vote;
      this.Actif = attachment.Actif;
    }
}