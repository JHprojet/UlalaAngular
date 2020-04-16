import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  constructor(private routerService:Router,private utilisateurService:UtilisateurDAL,private appService:AppComponent) { }
  Pseudo:string;
  Id:number;
  token:string;
  MessageOK:string;
  MessageNOK:string;
  MessageRenvoiOK:string;
  MessageRenvoiNOK:string;

  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
    this.Pseudo = this.appService.data["PseudoU"];
    this.Id = this.appService.data["IdU"];
    this.token = '';
    this.MessageOK = '';
    this.MessageNOK = '';
    this.MessageRenvoiOK = '';
    this.MessageRenvoiNOK = '';
  }

  public envoiToken()
  {
    this.MessageNOK = '';
    this.MessageOK = '';
    this.utilisateurService.UpdateToken(this.Id,this.token, this.appService.data['TK']).subscribe(result => {
      this.utilisateurService.getUtilisateur(this.Id, this.appService.data["TKA"]).subscribe(result => {
        this.appService.data["User"] = result;
        this.MessageOK = "Merci, votre compte à bien été activé, vous allez être rediriger dans un instant. Bonne navigation!";
        setTimeout(() => this.MessageOK='',3000);
        this.routerService.navigateByUrl('');
      })
    }, error => {
      this.MessageNOK = "Clef d'activation erronée, merci de réessayer. En cas de problème, veuillez contacter l'administrateur du site via la page de contact."
    })
  }

  public RenvoiToken()
  {
    this.MessageRenvoiOK = '';
    this.MessageRenvoiNOK = '';
    this.utilisateurService.RenvoiToken(this.appService.data["IdU"], this.appService.data['TK']).subscribe(result =>{
      this.MessageRenvoiOK= "Mail renvoyé, regardez dans votre boite mail ! (Et n'oubliez pas les spams!)";
      setTimeout(() => this.MessageRenvoiOK='',5000);
    }, error => {
      this.MessageRenvoiNOK = "Oops, une erreur sauvage semble être survenue, veuillez contacter l'administrateur du site via la page contact rubrique 'Activation de mon compte'";
      setTimeout(() => this.MessageRenvoiNOK='',10000);
    })
  }
}
