import { Component, OnInit } from '@angular/core';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';


@Component({
  selector: 'app-list-boss',
  templateUrl: './list-boss.component.html',
  styleUrls: ['./list-boss.component.css']
})
export class ListBossComponent implements OnInit {

  constructor(private serviceBossZone:BosszoneDAL) { }
  BossZone:BossZone[];

  ngOnInit(): void {
    this.BossZone = new Array<BossZone>();
    this.serviceBossZone.getBossZones().subscribe(result =>{
      this.BossZone = result;
    })
  }
}

