import { Component, OnInit } from '@angular/core';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/Classe';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {
  //Variable to fill in select
  selectClasse: Classe[];
  //Variable for active classe on select
  ClasseActive: Classe;
  //Lang
  Lang:string;

  constructor(private translate:TranslateService, private classeService:ClasseDAL) { }

  //Global note : Need to add content (Not a priority ATM).

  ngOnInit(): void {
    //Get current langage
    this.Lang = this.translate.currentLang;
    //Initialize variables
    this.ClasseActive = new Classe({});
    this.selectClasse = new Array<Classe>();
    //Fill the select with all classes
    this.classeService.getClasses().subscribe(response => {
      this.selectClasse = response;
    });
    //Register to LangChangeEvent and write selected langage in variable Lang
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.Lang = event.lang;
    });
  }

  //Change variable for displaying only one classe information
  changeClasse(Classe)
  {
    this.classeService.getClasse(Classe.value).subscribe(result => {
      this.ClasseActive = result;
    });
  }
}
