import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jouets',
  templateUrl: './jouets.component.html',
  styleUrls: ['./jouets.component.css']
})
export class JouetsComponent implements OnInit {

  constructor(private appService:AppComponent, private routerService:Router) { }

  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
  }

}
