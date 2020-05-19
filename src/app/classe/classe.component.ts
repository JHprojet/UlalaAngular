import { Component, OnInit } from '@angular/core';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/Classe';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {
  selectClasse: Classe[];
  ClasseActive: Classe;

  constructor(private classeService:ClasseDAL) { }

  //Note globale : Contenu à prévoir.

  ngOnInit(): void {
    this.ClasseActive = new Classe({});
    this.selectClasse = new Array<Classe>();
    //Remplissage liste déroulante avec classes
    this.classeService.getClasses().subscribe(response => {
      this.selectClasse = response;
    });
  }

  //Display de la classe choisie uniquement.
  changeClasse(Classe)
  {
    this.classeService.getClasse(Classe.value).subscribe(response => {
      this.ClasseActive = response;
    });
  }
}
