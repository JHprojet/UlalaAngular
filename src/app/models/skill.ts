import { Classe } from './classe';

export class Skill {
    Id: number;
    NomFR: string;
    NomEN: string;
    Classe: Classe;
    ImagePath: string;
    Actif: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.NomFR = attachment.NomFR;
      this.NomEN = attachment.NomEN;
      this.Classe = attachment.Classe;
      this.ImagePath = attachment.ImagePath;
      this.Actif = attachment.Actif;
    }
}
