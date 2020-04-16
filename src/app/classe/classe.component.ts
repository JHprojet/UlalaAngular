import { Component, OnInit } from '@angular/core';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/Classe';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {
  selectClasse: Classe[];
  ClasseActive: Classe;

  constructor(private classeService:ClasseDAL, private appService:AppComponent, private routerService:Router) { }

  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
    this.ClasseActive = new Classe({});
    this.selectClasse = new Array<Classe>();
    this.classeService.getClasses(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
      this.selectClasse = response;
    });
  }

  changeClasse(Classe)
  {
    this.classeService.getClasse(Classe.value, this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
      this.ClasseActive = response;
    });
  }
}
