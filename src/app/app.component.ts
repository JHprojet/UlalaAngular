import { Component, Inject } from '@angular/core';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { Utilisateur } from './models/utilisateur';
import { UtilisateurDAL } from './service/utilisateur-dal';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

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
  MessageRecupPassword:string="";

  constructor(private router:Router,@Inject(SESSION_STORAGE) private session: WebStorageService, private UtilisateurService:UtilisateurDAL) { 
    this.getFromSession("User");
    this.getAnonymeKey();
  }

  Connection()
  {
    this.MessageRecupPassword="";
    this.ErrorLogin = "";
    this.OkLogin = "";
    this.UtilisateurService.CheckUser(new Utilisateur({Pseudo:this.login, Password:this.password}), this.data["TKA"]).subscribe(result => {
      this.saveInSession("TK", result);
      this.UtilisateurService.getUtilisateurByPseudo(this.login, this.data["TK"]).subscribe(result2 => {
        if (result2.ActivationToken != '')
        {
          this.saveInSession("IdU", result2.Id);
          this.saveInSession("PseudoU", result2.Pseudo);
          this.router.navigateByUrl('activation');
        }
        else
        {
          this.saveInSession("User", result2);
          this.OkLogin = "Connexion réussie.";
          setTimeout(() => this.OkLogin = "", 3000);
        }  
      });
    },error => {
      this.MessageRecupPassword="Perdu votre mot de passe ou votre pseudo? Cliquez ici!";
      this.ErrorLogin = "Utilisateur ou Mot de passe invalide";
      setTimeout(() => this.ErrorLogin = "", 3000);
      setTimeout(() => this.MessageRecupPassword = "", 7000);
    });
  }

  Disconnection()
  {
    this.saveInSession("User", null);
    this.saveInSession("TK", null)
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

   getAnonymeKey()
   {
    if (!this.data["TKA"])
    {
      this.UtilisateurService.GetAnonymeToken().subscribe(result => {
        this.data["TKA"] = result;
        this.saveInSession("TKA", result);
      })
    }
   }
}


