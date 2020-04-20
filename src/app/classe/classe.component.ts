import { Component, OnInit, Inject } from '@angular/core';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/Classe';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {
  selectClasse: Classe[];
  ClasseActive: Classe;

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService,private classeService:ClasseDAL, private routerService:Router) { }

  ngOnInit(): void {
    if(!this.session.get("TKA"))
    {
      this.routerService.navigateByUrl("/")
    }
    this.ClasseActive = new Classe({});
    this.selectClasse = new Array<Classe>();
    this.classeService.getClasses(this.session.get("TK")??this.session.get("TKA")).subscribe(response => {
      this.selectClasse = response;
    });
  }

  changeClasse(Classe)
  {
    this.classeService.getClasse(Classe.value, this.session.get("TK")??this.session.get("TKA")).subscribe(response => {
      this.ClasseActive = response;
    });
  }
}
