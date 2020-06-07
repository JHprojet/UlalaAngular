export class Zone {
    Id: number;
    ContinentFR: string;
    ContinentEN: string;
    ZoneFR: string;
    ZoneEN: string;
    ZoneQty: number;
    Active: number;  
    constructor(attachment) {
      this.Id = attachment.Id;
      this.ContinentEN = attachment.ContinentEN;
      this.ContinentFR = attachment.ContinentFR;
      this.ZoneFR = attachment.ZoneFR;
      this.ZoneEN = attachment.ZoneEN;
      this.ZoneQty = attachment.ZoneQty;
      this.Active = attachment.Active;
    }
}
