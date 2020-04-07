import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UtilisateurDAL } from '../service/utilisateur-dal';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  constructor(private utilisateurService:UtilisateurDAL,private appService:AppComponent) { }
  Pseudo:string;
  Id:number;
  token:string;
  MessageOK:string;
  MessageNOK:string;
  MessageRenvoiOK:string;
  MessageRenvoiNOK:string;

  ngOnInit(): void {
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
    this.utilisateurService.UpdateToken(this.Id,this.token).subscribe(result => {
      this.utilisateurService.getUtilisateur(this.Id).subscribe(result => {
        this.appService.data["User"] = result;
        this.MessageOK = "Merci, votre compte à bien été activé, vous pouvez naviguer sur le site."
      })
    }, error => {
      this.MessageNOK = "Clef d'activation erronée, merci de recommencer."
    })
  }

  public RenvoiToken()
  {
    this.MessageRenvoiOK = '';
    this.MessageRenvoiNOK = '';
    this.utilisateurService.RenvoiToken(this.appService.data["IdU"]).subscribe(result =>{
      this.MessageRenvoiOK= "Mail renvoyé, regardez dans votre boite mail ! (Et n'oubliez pas les spams!)";
      setTimeout(() => this.MessageRenvoiOK='',5000);
    }, error => {
      this.MessageRenvoiNOK = "Oops, une erreur sauvage semble être survenue, veuillez contacter l'administrateur du site via la page contact rubrique 'Activation de mon compte'";
      setTimeout(() => this.MessageRenvoiNOK='',10000);
    })
  }
}
