import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { Utilisateur } from '../models/utilisateur';

@Component({
  selector: 'app-mes-infos',
  templateUrl: './mes-infos.component.html',
  styleUrls: ['./mes-infos.component.css']
})
export class MesInfosComponent implements OnInit {

  constructor(private appService:AppComponent, private routerService:Router) { }
  User:Utilisateur;
  

  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/");
    }
    this.User = this.appService.data["User"];
  }

}
