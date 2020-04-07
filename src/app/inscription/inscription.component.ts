import { Component, OnInit } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal'
import { Router } from '@angular/router';
import { Utilisateur } from '../models/utilisateur';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  username:string;
  alertUsername:string;
  password:string;
  alertPassword:string;
  passwordVerif:string;
  alertPasswordVerif:string;
  email:string;
  alertEmail:string;
  emailVerif:string;
  alertEmailVerif:string;
  inscriptionReussi:string;
  Waiting:string;

  constructor(private UtilisateurService:UtilisateurDAL, private router: Router) { }

  ngOnInit(): void {
    this.username="";
    this.alertUsername="";
    this.email="";
    this.alertEmail="";
    this.emailVerif="";
    this.alertEmailVerif="";
    this.password="";
    this.alertPassword="";
    this.passwordVerif="";
    this.alertPasswordVerif="";
    this.inscriptionReussi="";
  }

  public EnvoiFormulaire()
  {
    this.CheckUsername();
    this.CheckPassword();
    this.CheckPasswordVerif();
    this.CheckEmail();
    this.CheckEmailVerif();
    setTimeout(() => {
      if(this.alertEmail == "" && this.alertUsername == "" && this.alertPassword == "" && this.alertPasswordVerif == "" && this.alertEmailVerif == "")
      {
        this.UtilisateurService.postUtilisateur({ Id:null, Pseudo:this.username, Mail:this.email, Password:this.password, Role:null, Actif:null, ActivationToken:null }).subscribe(result => { 
          this.inscriptionReussi="Vous êtes bien inscris. Vous pouvez vous connecter en haut à droite de l'écran.";
        }, error =>{
          this.inscriptionReussi="Oops il semble qu'il y ai eu un problème. Merci de recommencer.";
        });
      }
    },1000); 
  }

  public CheckUsername()
  {
    let re = /^[\w \-]+$/;
    this.alertUsername = "";
    if (this.username == "") this.alertUsername = "Champ obligatoire.";
    else if (this.username.length < 3) this.alertUsername = "Votre pseudo doit faire au moins 3 caractères.";
    else if (this.username.length > 20) this.alertUsername = "Votre pseudo doit faire 20 caractères maximum."
    else if (!re.test(this.username)) this.alertUsername = "Votre pseudo ne peux pas contenir de caractères spéciaux (excepté '-' ou '_').";
    else this.UtilisateurService.getUtilisateurByPseudo(this.username).subscribe(response => {
            this.alertUsername = "L'utilisateur existe déjà. Choisissez un autre pseudo."});     
  }
  public CheckEmail()
  {
    let test:boolean;
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.alertEmail = "";
    if (this.email == "") this.alertEmail = "Champ obligatoire.";
    else if (!re.test(this.email)) this.alertEmail = "Merci de saisir un E-mail au bon format."
    else this.UtilisateurService.getUtilisateurByMail(this.email).subscribe(response => {
            this.alertEmail = "L'E-mail est déjà utilisé."});
  }
  public CheckEmailVerif()
  {
    this.alertEmailVerif="";
    if (this.emailVerif == "") this.alertEmailVerif = "Champ obligatoire."
    else if (this.emailVerif != this.email) this.alertEmailVerif = "Vos deux E-mail ne sont pas identiques."
  }
  public CheckPassword()
  {
    this.alertPassword="";
    if (this.password == "") this.alertPassword = "Champ obligatoire."
    else if (this.password.length < 7) this.alertPassword = "Votre mot de passe doit faire au moins 8 caractères."
    else if (this.password.length > 40) this.alertPassword = "Votre mot de passe doit faire 40 caractères maximum."
  }
  public CheckPasswordVerif()
  {
    this.alertPasswordVerif="";
    if (this.passwordVerif == "") this.alertPasswordVerif = "Champ obligatoire."
    else if (this.passwordVerif != this.password) this.alertPasswordVerif = "Vos deux mots de passe ne sont pas identiques."
  }
}
