import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SkillDAL } from '../service/skill-dal';
import { Skill } from '../models/skill';
import { Classe } from '../models/classe';
import { ClasseDAL } from '../service/classe-dal';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { AccessComponent } from '../helpeur/access-component';
import { zip } from 'rxjs';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  constructor(private accessService:AccessComponent,@Inject(SESSION_STORAGE) private session: WebStorageService,private classeService:ClasseDAL,private skillService:SkillDAL,private routerService:Router) { }
  Skills:Skill[];
  SkillsBase:Skill[];
  selectClasse:Classe[];

  ngOnInit(): void {
    this.Skills = new Array<Skill>();
    zip(this.accessService.CheckAno$).subscribe(() => {
      this.skillService.getSkills().subscribe(result =>
      {
        this.SkillsBase = result;
      });
      this.classeService.getClasses().subscribe(response => {
        this.selectClasse = response;
        this.accessService.CheckAno$.closed;
      });
    });
  }

  //Filtre la liste de skill en fonction de la liste déroulante onChange
  public changeClasse(classe)
  {
    if (classe.value == 0) this.Skills = this.SkillsBase;
    else this.Skills = this.SkillsBase.filter(result => result.Classe.Id == classe.value);
  }
}
