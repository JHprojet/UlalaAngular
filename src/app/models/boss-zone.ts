import { Zone } from './zone';
import { Boss } from './boss';


export class BossZone {
    Id: number;
    Zone: Zone;
    Boss: Boss;
    Actif: number;
  
    constructor(attachment) {
      this.Id = attachment.Id;
      this.Zone = attachment.Zone;
      this.Boss = attachment.Boss;
      this.Actif = attachment.Actif;
    }
}