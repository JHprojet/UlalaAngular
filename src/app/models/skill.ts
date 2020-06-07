import { Classe } from './classe';

export class Skill {
    Id: number;
    NameFR: string;
    NameEN: string;
    DescriptionFR: string;
    DescriptionEN: string;
    Location: string;
    Cost: number;
    Classe: Classe;
    ImagePath: string;
    Active: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.NameFR = attachment.NameFR;
      this.NameEN = attachment.NameEN;
      this.DescriptionFR = attachment.DescriptionFR;
      this.DescriptionEN = attachment.DescriptionEN;
      this.Location = attachment.Location;
      this.Cost = attachment.Cost;
      this.Classe = attachment.Classe;
      this.ImagePath = attachment.ImagePath;
      this.Active = attachment.Active;
    }
}