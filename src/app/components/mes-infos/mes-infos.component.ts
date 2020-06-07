import { Component, OnInit } from '@angular/core';
import { User } from '../../models';
import { AccessService } from '../../services';

@Component({
  selector: 'app-mes-infos',
  templateUrl: './mes-infos.component.html',
  styleUrls: ['./mes-infos.component.css']
})
export class MesInfosComponent implements OnInit {

  constructor(private accessService:AccessService) { }
  User:User;
  
  //Ajout de contenu prévu plus tard.
  ngOnInit(): void {
    this.User = this.accessService.getSession("Info");
  }

}
