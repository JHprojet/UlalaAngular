import { Component, Inject } from '@angular/core';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Utilisateur } from './models/utilisateur';
import { UtilisateurDAL } from './service/utilisateur-dal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ulala';
  public data:any=[];
  login:string;
  password:string;
  ErrorLogin:string = "";
  OkLogin:string ="";
  NotConnected:string="";
  Disconnected:string="";

  constructor(private router:Router,@Inject(SESSION_STORAGE) private session: WebStorageService, private UtilisateurService:UtilisateurDAL) { 
    this.getFromSession("User");
  }

  Connection()
  {
    this.ErrorLogin = "";
    this.OkLogin = "";
    this.UtilisateurService.CheckUser(new Utilisateur({Pseudo:this.login, Password:this.password})).subscribe(result => {
      this.UtilisateurService.getUtilisateurByPseudo(this.login).subscribe(result2 => {
        console.log(result2.body.ActivationToken);
        if (result2.body.ActivationToken != '')
        {
          this.saveInSession("IdU", result2.body.Id);
          this.saveInSession("PseudoU", result2.body.Pseudo);
          this.router.navigateByUrl('activation');
        }
        else
        {
          this.saveInSession("User", result2.body);
          this.OkLogin = "Connexion réussie.";
          setTimeout(() => this.OkLogin = "", 3000);
        }  
      });
    },error => {
      this.ErrorLogin = "Utilisateur ou Mot de passe invalide";
      setTimeout(() => this.ErrorLogin = "", 3000);
    });
  }

  Disconnection()
  {
    this.saveInSession("User", null);
    this.router.navigateByUrl('/');
    this.Disconnected = "Vous avez bien été déconnecté.";
    setTimeout(() => this.Disconnected = "", 3000);

  }

  saveInSession(key, val): void {
    this.session.set(key, val);
    this.data[key]= this.session.get(key);
   }

   getFromSession(key): void {
    this.data[key]= this.session.get(key);
   }
}


