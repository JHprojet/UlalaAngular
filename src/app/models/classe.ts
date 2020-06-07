export class Classe {
    Id: number;
    NameFR: string;
    NameEN: string;
    Actif: string;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.NameFR = attachment.NameFR;
      this.NameEN = attachment.NameEN;
      this.Actif = attachment.Actif;
    }
}
