export class Jouet {
    Id: number;
    NomFR: string;
    NomEN: string;
    ImagePath: string;
    Actif: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.NomEN = attachment.NomEN;
      this.NomFR = attachment.NomFR;
      this.ImagePath = attachment.ImagePath;
      this.Actif = attachment.Actif;
    }
}
