export class Boss {
    Id: number;
    NomFR: string;
    NomEN: string;
    Actif: number;
  
    constructor(attachment) {
      this.Id = attachment.Id;
      this.NomEN = attachment.NomEN;
      this.NomFR = attachment.NomFR;
      this.Actif = attachment.Actif;
    }
}