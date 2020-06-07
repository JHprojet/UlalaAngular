import { Classe } from './classe';

export class CharactersConfiguration {
    Id: number;
    Classe1: Classe;
    Classe2: Classe;
    Classe3: Classe;
    Classe4: Classe;
    Active: string;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Classe1 = attachment.Classe1;
      this.Classe2 = attachment.Classe2;
      this.Classe3 = attachment.Classe3;
      this.Classe4 = attachment.Classe4;
      this.Active = attachment.Active;
    }
}
