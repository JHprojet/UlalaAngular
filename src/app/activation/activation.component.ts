import { Component, OnInit } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Router } from '@angular/router';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  constructor(private accessService:AccessComponent, private routerService:Router, private utilisateurService:UtilisateurDAL) { }
  
  Pseudo:string; //Pseudo de l'utilisateur pour affichage sur la page
  Token:string; //Token renseigné par l'utilisateur
  DisplayValidationOk:boolean; //Display message si validation OK
  DisplayValidationErreur:boolean; //Display message si validation Erreur
  DisplayRenvoiTokenOk:boolean; //Display message si renvoi du token par mail OK
  DisplayRenvoiTokenErreur:boolean; //Display message si renvoi du token par mail Erreur

  ngOnInit(): void {
    this.Pseudo = this.accessService.data["Pseudo"];
    this.Token = '';
    this.DisplayValidationOk = false;
    this.DisplayValidationErreur = false;
    this.DisplayRenvoiTokenOk = false;
    this.DisplayRenvoiTokenErreur = false;
  }

  // Une fois le token renseigné et appuie sur bouton "Envoyer"
  // 1 - Cache les messages d'erreur si affichés.
  // 2 - Affiche un message "Token invalide" si Check dans la DB = Pas de match.
  // 3 - Si Token valide, connecte l'utilisateur et affiche un message de validation (Suppression du token en DB = compte activé).
  // 3a - Supprime les variables préalablement utilisées de la session et du tableau de session local.
  // 3b - Attend 3 secondes et redirige l'utilisateur vers la page d'accueil.
  public envoiToken()
  {
    this.DisplayValidationOk = false;
    this.DisplayValidationErreur = false;
    this.utilisateurService.UpdateToken(this.accessService.data["Id"], this.Token, this.accessService.data["Anonyme"]).subscribe(() => {
      this.utilisateurService.getUtilisateur(this.accessService.data["Id"], this.accessService.data["User"]).subscribe(result => {
        this.accessService.data["Info"] = result;
        this.accessService.setSession("Info", result);
        this.accessService.deleteSession("Pseudo");
        this.accessService.deleteSession("Id");
        this.DisplayValidationOk = true;
        setTimeout(() => {
          this.DisplayValidationOk = false;
          this.routerService.navigateByUrl('');
        },3000);
      });
    }, error => { this.DisplayValidationErreur = true; })
  }

  // Si l'utilisateur clique sur le bouton "Renvoyer token"
  // 1 - Cache les messages d'erreur si affichés.
  // 2 - Affiche un message "Mail renvoyé" si retour success de l'API (s'efface au bout de 5s).
  // 3 - Affiche un message d'erreur si retour échec de la DB (s'efface au bout de 10s).
  public RenvoiToken()
  {
    this.DisplayRenvoiTokenOk = false;
    this.DisplayRenvoiTokenErreur = false;
    this.utilisateurService.RenvoiToken(this.accessService.data["Id"], this.accessService.data["Anonyme"]).subscribe(() =>{
      this.DisplayRenvoiTokenOk = true;
      setTimeout(() => { this.DisplayRenvoiTokenOk = false; },5000);
    }, error => {
      this.DisplayRenvoiTokenErreur = true;
      setTimeout(() => { this.DisplayRenvoiTokenErreur = false; },10000);
    })
  }
}
