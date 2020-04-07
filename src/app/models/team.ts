import { Classe } from './classe';

export class Team {
    Id: number;
    Classe1: Classe;
    Classe2: Classe;
    Classe3: Classe;
    Classe4: Classe;
    Actif: string;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Classe1 = attachment.Classe1;
      this.Classe2 = attachment.Classe2;
      this.Classe3 = attachment.Classe3;
      this.Classe4 = attachment.Classe4;
      this.Actif = attachment.Actif;
    }
}
