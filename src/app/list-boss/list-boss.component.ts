import { Component, OnInit } from '@angular/core';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';
import { AccessComponent } from '../helpeur/access-component';


@Component({
  selector: 'app-list-boss',
  templateUrl: './list-boss.component.html',
  styleUrls: ['./list-boss.component.css']
})
export class ListBossComponent implements OnInit {

  constructor(private accessService:AccessComponent,private serviceBossZone:BosszoneDAL) { }
  BossZone:BossZone[];

  //Simple récupération d'une liste d'objet via API + display sous forme de tableau.
  ngOnInit(): void {
    this.BossZone = new Array<BossZone>();
    this.serviceBossZone.getBossZones(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(result =>{
      this.BossZone = result;
    })
  }
}

