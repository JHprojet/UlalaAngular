export class Zone {
    Id: number;
    ContinentFR: string;
    ContinentEN: string;
    ZoneFR: string;
    ZoneEN: string;
    NbZones: number;
    Actif: number;  
    constructor(attachment) {
      this.Id = attachment.Id;
      this.ContinentEN = attachment.ContinentEN;
      this.ContinentFR = attachment.ContinentFR;
      this.ZoneFR = attachment.ZoneFR;
      this.ZoneEN = attachment.ZoneEN;
      this.NbZones = attachment.NbZones;
      this.Actif = attachment.Actif;
    }
}
