import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SkillDAL } from '../service/skill-dal';
import { Skill } from '../models/skill';
import { Classe } from '../models/classe';
import { ClasseDAL } from '../service/classe-dal';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService,private classeService:ClasseDAL,private skillService:SkillDAL,private routerService:Router) { }
  Skills:Skill[];
  SkillsBase:Skill[];
  selectClasse:Classe[];

  ngOnInit(): void {
    if(this.session.get("TKA") == null)
    {
      this.routerService.navigateByUrl("/")
    }
    this.Skills = new Array<Skill>();
    this.skillService.getSkills(this.session.get("TK")??this.session.get("TKA")).subscribe(result =>
     {
       this.SkillsBase = result;
     });
     this.classeService.getClasses(this.session.get("TK")??this.session.get("TKA")).subscribe(response => {
      this.selectClasse = response;
    });
      
  }

  public changeClasse(classe)
  {
    if (classe.value == 0) this.Skills = this.SkillsBase;
    else this.Skills = this.SkillsBase.filter(result => result.Classe.Id == classe.value);
  }
}
