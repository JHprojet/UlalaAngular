import { Component, OnInit, Inject } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService,private routerService:Router,private utilisateurService:UtilisateurDAL) { }
  Pseudo:string;
  Id:number;
  token:string;
  MessageOK:string;
  MessageNOK:string;
  MessageRenvoiOK:string;
  MessageRenvoiNOK:string;

  ngOnInit(): void {
    if(!this.session.get("TKA"))
    {
      this.routerService.navigateByUrl("/")
    }
    this.Pseudo = this.session.get("PseudoU");
    this.Id = this.session.get("IdU");
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
    console.log(this.session.get("TKA"));
    this.utilisateurService.UpdateToken(this.Id, this.token, this.session.get("TKA")).subscribe(result => {
      this.utilisateurService.getUtilisateur(this.Id, this.session.get("TKA")).subscribe(result => {
        this.session.set("User",result);
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
    this.utilisateurService.RenvoiToken(this.session.get("IdU"), this.session.get("TKA")).subscribe(result =>{
      this.MessageRenvoiOK= "Mail renvoyé, regardez dans votre boite mail ! (Et n'oubliez pas les spams!)";
      setTimeout(() => this.MessageRenvoiOK='',5000);
    }, error => {
      this.MessageRenvoiNOK = "Oops, une erreur sauvage semble être survenue, veuillez contacter l'administrateur du site via la page contact rubrique 'Activation de mon compte'";
      setTimeout(() => this.MessageRenvoiNOK='',10000);
    })
  }
}
