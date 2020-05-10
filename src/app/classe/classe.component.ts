import { Component, OnInit } from '@angular/core';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/Classe';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {
  selectClasse: Classe[];
  ClasseActive: Classe;

  constructor(private accessService:AccessComponent,private classeService:ClasseDAL) { }

  //Note globale : Contenu à prévoir.

  ngOnInit(): void {
    this.accessService.getAnonymeKey();
    this.ClasseActive = new Classe({});
    this.selectClasse = new Array<Classe>();
    //Remplissage liste déroulante avec classes
    this.classeService.getClasses(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
      this.selectClasse = response;
    });
  }

  //Display de la classe choisie uniquement.
  changeClasse(Classe)
  {
    this.classeService.getClasse(Classe.value, this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
      this.ClasseActive = response;
    });
  }
}
