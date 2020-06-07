import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { SkillService, ClasseService, environement } from '../../services';
import { Skill, Classe } from '../../models';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  constructor(private translate:TranslateService,private classeService:ClasseService,private skillService:SkillService) { }
  //All skills
  SkillsBase:Skill[];
  //Skill displayed in the table
  Skills:Skill[];
  //Variable to fill in the select
  selectClasse:Classe[];
  //Language
  Lang:string;
  //EndPoint image server
  BaseURL:string;

  ngOnInit(): void {
    this.BaseURL = environement.ImagePath;
    //Init Language
    this.Lang = this.translate.currentLang
    //Init and get Skills and classes
    this.Skills = new Array<Skill>();
    this.skillService.getSkills().subscribe(result => { this.SkillsBase = result; });
    this.classeService.getClasses().subscribe(response => {
      this.selectClasse = response;
    });
    //Register to LangChangeEvent and write selected langage in variable Lang
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.Lang = event.lang;
    });
  }

  //Filter Skills onchange of the select
  public changeClasse(classe)
  {
    if (classe.value == 0) this.Skills = this.SkillsBase;
    else this.Skills = this.SkillsBase.filter(result => result.Classe.Id == classe.value);
  }
}
