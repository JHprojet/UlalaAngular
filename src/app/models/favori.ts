import { Utilisateur } from './utilisateur';
import { Enregistrement } from './enregistrement';

export class Favori {
    Id: number;
    Utilisateur: Utilisateur;
    Enregistrement: Enregistrement;
    Actif: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Utilisateur = attachment.Utilisateur;
      this.Enregistrement = attachment.Enregistrement;
      this.Actif = attachment.Actif;
    }
}