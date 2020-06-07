import { Zone } from './zone';
import { Boss } from './boss';


export class BossesPerZone {
    Id: number;
    Zone: Zone;
    Boss: Boss;
    Active: number;
  
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Zone = attachment.Zone;
      this.Boss = attachment.Boss;
      this.Active = attachment.Actif;
    }
}