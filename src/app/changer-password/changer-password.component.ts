import { Component, OnInit, Inject } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Utilisateur } from '../models/utilisateur';
import { zip, Subject } from 'rxjs';
import { AccessComponent } from '../helpeur/access-component';

const Check1$ = new Subject<boolean>();
const Check2$ = new Subject<boolean>();
const Check3$ = new Subject<boolean>();

@Component({
  selector: 'app-changer-password',
  templateUrl: './changer-password.component.html',
  styleUrls: ['./changer-password.component.css']
})
export class ChangerPasswordComponent implements OnInit {

  constructor(private accessService:AccessComponent,private utilisateurService:UtilisateurDAL) { }
  CurrentPassword:string;
  NewPassword:string;
  NewPasswordVerif:string;
  MessageOK:string;
  MessageNOK:string;
  alertPassword:string;
  alertPasswordVerif:string;
  alertCurrentPassword:string;

  // /!\ A transformer en FormBuilder pour simplifier le component

  ngOnInit(): void {
    this.MessageNOK ='';
    this.MessageOK ='';
    this.alertPassword ='';
    this.alertPasswordVerif='';
    this.alertCurrentPassword='';
    this.NewPassword='';
    this.CurrentPassword='';
    this.NewPasswordVerif='';
  }

  //Vérification du mot de passer actuel
  public CheckCurrentPassword()
  {
    this.alertCurrentPassword ='';
    this.utilisateurService.CheckUser(new Utilisateur({Password:this.CurrentPassword, Pseudo:this.accessService.data["Info"].Pseudo}), this.accessService.data["User"]).subscribe(result =>{
      Check1$.next(true);
    }, error => {
      this.alertCurrentPassword = 'Votre mot de passe est erroné.'
    })
  }

  //Vérification du nouveau mot de passe : longueur. A ajouter plus tard : Majuscule et caractère spéciaux.
  public CheckPassword()
  {
    this.alertPassword="";
    if (this.NewPassword == "") this.alertPassword = "Champ obligatoire."
    else if (this.NewPassword.length < 7) this.alertPassword = "Votre mot de passe doit faire au moins 8 caractères."
    else if (this.NewPassword.length > 40) this.alertPassword = "Votre mot de passe doit faire 40 caractères maximum."
    else Check2$.next(true);
  }
  
  //Vérification confirmation de password identique au précédent.
  public CheckPasswordVerif()
  {
    this.alertPasswordVerif="";
    if (this.NewPasswordVerif == "") this.alertPasswordVerif = "Champ obligatoire."
    else if (this.NewPassword != this.NewPasswordVerif) this.alertPasswordVerif = "Vos deux mots de passe ne sont pas identiques."
    else Check3$.next(true);
  }

  //Validation du nouveau password
  ChangePassword()
  {
    this.CheckCurrentPassword();
    this.CheckPassword();
    this.CheckPasswordVerif(); 
    this.MessageOK='';
    this.MessageNOK='';
    //Si les 3 checks sont ok
    zip(Check1$, Check2$, Check3$).subscribe(() => {
      if (Check1$ && Check2$ && Check3$)
      {
        this.utilisateurService.changePassword(this.accessService.data["Info"].Id,this.NewPassword, this.accessService.data["User"]).subscribe(result => {
          //Si changement ok via API, reset des variables et display message réussi.
          this.NewPassword ='';
          this.NewPasswordVerif='';
          this.CurrentPassword='';
          this.MessageOK='Votre password a bien été modifié.'
          setTimeout(() => this.MessageOK='',5000);
        }, error => {
          //Si erreur lors de l'envoi à l'API.
          this.MessageNOK="Oops, un problème sauvage est survenue, contactez l'administrateur du site via la page de contact."
          setTimeout(() => this.MessageNOK='',5000);
        })
      }
    });
  }
}
