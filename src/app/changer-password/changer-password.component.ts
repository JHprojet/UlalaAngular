import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changer-password',
  templateUrl: './changer-password.component.html',
  styleUrls: ['./changer-password.component.css']
})
export class ChangerPasswordComponent implements OnInit {

  constructor(private appService:AppComponent, private router:Router) { }

  ngOnInit(): void {
    //Check si connecté
    this.appService.NotConnected = "";
    this.appService.getFromSession("User");
    if (this.appService.data["User"] == null) 
    {
      this.router.navigateByUrl('/');
      this.appService.NotConnected = "Vous devez être connecter pour accéder à cette page";
      setTimeout(() => this.appService.NotConnected = "", 3000);
    }
  }

}
