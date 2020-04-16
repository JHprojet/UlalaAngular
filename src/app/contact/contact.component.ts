import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private appService:AppComponent, private routerService:Router) { }

  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
  }

}
