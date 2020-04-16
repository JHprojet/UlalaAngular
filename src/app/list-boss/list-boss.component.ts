import { Component, OnInit } from '@angular/core';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-boss',
  templateUrl: './list-boss.component.html',
  styleUrls: ['./list-boss.component.css']
})
export class ListBossComponent implements OnInit {

  constructor(private routerService:Router,private serviceBossZone:BosszoneDAL, private appService:AppComponent) { }
  BossZone:BossZone[];

  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
    this.BossZone = new Array<BossZone>();
    this.serviceBossZone.getBossZones(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(result =>{
      this.BossZone = result;
    })
  }
}

