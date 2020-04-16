import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  constructor(private routerService:Router,private appService:AppComponent) { }

  ngOnInit(): void {
    if(!this.appService.data ["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
  }

}
