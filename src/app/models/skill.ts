import { Classe } from './classe';

export class Skill {
    Id: number;
    NomFR: string;
    NomEN: string;
    DescFR: string;
    DescEN: string;
    Location: string;
    Cost: number;
    Classe: Classe;
    ImagePath: string;
    Actif: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.NomFR = attachment.NomFR;
      this.NomEN = attachment.NomEN;
      this.DescEN = attachment.DescEN;
      this.DescFR = attachment.DescFR;
      this.Location = attachment.Location;
      this.Cost = attachment.Cost;
      this.Classe = attachment.Classe;
      this.ImagePath = attachment.ImagePath;
      this.Actif = attachment.Actif;
    }
}