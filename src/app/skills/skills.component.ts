import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { SkillDAL } from '../service/skill-dal';
import { Skill } from '../models/skill';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  constructor(private skillService:SkillDAL,private routerService:Router,private appService:AppComponent) { }
  Skills:Skill[];

  ngOnInit(): void {
    if(!this.appService.data ["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
    this.Skills = new Array<Skill>();
    this.skillService.getSkills(this.appService.data ["TK"]??this.appService.data ["TKA"]).subscribe(result =>
     {
       this.Skills = result;
     }
      )
  }

}
