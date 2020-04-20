import { Component, OnInit, Inject } from '@angular/core';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';


@Component({
  selector: 'app-list-boss',
  templateUrl: './list-boss.component.html',
  styleUrls: ['./list-boss.component.css']
})
export class ListBossComponent implements OnInit {

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService,private routerService:Router,private serviceBossZone:BosszoneDAL) { }
  BossZone:BossZone[];

  ngOnInit(): void {
    if(!this.session.get("TKA"))
    {
      this.routerService.navigateByUrl("/")
    }
    this.BossZone = new Array<BossZone>();
    this.serviceBossZone.getBossZones(this.session.get("TK")??this.session.get("TKA")).subscribe(result =>{
      this.BossZone = result;
    })
  }
}

