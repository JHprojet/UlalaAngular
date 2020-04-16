import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Utilisateur } from '../models/utilisateur';
import { zip, Subject } from 'rxjs';

const Check1$ = new Subject<boolean>();
const Check2$ = new Subject<boolean>();
const Check3$ = new Subject<boolean>();

@Component({
  selector: 'app-changer-password',
  templateUrl: './changer-password.component.html',
  styleUrls: ['./changer-password.component.css']
})
export class ChangerPasswordComponent implements OnInit {

  constructor(private utilisateurService:UtilisateurDAL,private appService:AppComponent, private routerService:Router) { }
  CurrentPassword:string;
  NewPassword:string;
  NewPasswordVerif:string;
  MessageOK:string;
  MessageNOK:string;
  alertPassword:string;
  alertPasswordVerif:string;
  alertCurrentPassword:string;

  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
    this.MessageNOK ='';
    this.MessageOK ='';
    this.alertPassword ='';
    this.alertPasswordVerif='';
    this.alertCurrentPassword='';
    this.NewPassword='';
    this.CurrentPassword='';
    this.NewPasswordVerif='';
  }

  public CheckCurrentPassword()
  {
    this.alertCurrentPassword ='';
    this.utilisateurService.CheckUser(new Utilisateur({Password:this.CurrentPassword, Pseudo:this.appService.data["User"].Pseudo}), this.appService.data["TK"]).subscribe(result =>{
      Check1$.next(true);
    }, error => {
      this.alertCurrentPassword = 'Votre mot de passe est erroné.'
    })
  }

  public CheckPassword()
  {
    this.alertPassword="";
    if (this.NewPassword == "") this.alertPassword = "Champ obligatoire."
    else if (this.NewPassword.length < 7) this.alertPassword = "Votre mot de passe doit faire au moins 8 caractères."
    else if (this.NewPassword.length > 40) this.alertPassword = "Votre mot de passe doit faire 40 caractères maximum."
    else Check2$.next(true);
  }
  
  public CheckPasswordVerif()
  {
    this.alertPasswordVerif="";
    if (this.NewPasswordVerif == "") this.alertPasswordVerif = "Champ obligatoire."
    else if (this.NewPassword != this.NewPasswordVerif) this.alertPasswordVerif = "Vos deux mots de passe ne sont pas identiques."
    else Check3$.next(true);
  }

  ChangePassword()
  {
    this.CheckCurrentPassword();
    this.CheckPassword();
    this.CheckPasswordVerif(); 
    this.MessageOK='';
    this.MessageNOK='';
    zip(Check1$, Check2$, Check3$).subscribe(() => {
      if (Check1$ && Check2$ && Check3$)
      {
        this.utilisateurService.changePassword(this.appService.data["User"].Id,this.NewPassword, this.appService.data['TK']).subscribe(result => {
          this.appService.data["User"].password = this.NewPassword;
          this.NewPassword ='';
          this.NewPasswordVerif='';
          this.CurrentPassword='';
          this.MessageOK='Votre password a bien été modifié.'
          setTimeout(() => this.MessageOK='',5000);
        }, error => {
          this.MessageNOK="Oops, un problème sauvage est survenue, contactez l'administrateur du site via la page de contact."
          setTimeout(() => this.MessageNOK='',5000);
        })
      }
    });
  }
}
