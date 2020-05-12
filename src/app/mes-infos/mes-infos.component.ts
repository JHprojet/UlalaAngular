import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../models/utilisateur';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-mes-infos',
  templateUrl: './mes-infos.component.html',
  styleUrls: ['./mes-infos.component.css']
})
export class MesInfosComponent implements OnInit {

  constructor(private accessService:AccessComponent) { }
  User:Utilisateur;
  
  //Ajout de contenu prévu plus tard.
  ngOnInit(): void {
    this.User = this.accessService.getSession("Info");
  }

}
