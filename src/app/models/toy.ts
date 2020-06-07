export class Toy {
    Id: number;
    NomFR: string;
    NomEN: string;
    ImagePath: string;
    Active: number;
    constructor(attachment) {
      this.Id = attachment.Id;
      this.NomEN = attachment.NomEN;
      this.NomFR = attachment.NomFR;
      this.ImagePath = attachment.ImagePath;
      this.Active = attachment.Active;
    }
}
