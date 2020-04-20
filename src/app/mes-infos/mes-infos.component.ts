import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateur } from '../models/utilisateur';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-mes-infos',
  templateUrl: './mes-infos.component.html',
  styleUrls: ['./mes-infos.component.css']
})
export class MesInfosComponent implements OnInit {

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService, private routerService:Router) { }
  User:Utilisateur;
  

  ngOnInit(): void {
    if(!this.session.get("TKA") || !this.session.get("TK"))
    {
      this.routerService.navigateByUrl("/")
    }
    this.User = this.session.get("User");
  }

}
