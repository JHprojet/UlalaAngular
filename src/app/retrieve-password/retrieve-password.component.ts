import { Component, OnInit } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { zip, Subject } from 'rxjs';
import { AccessComponent } from '../helpeur/access-component';

const CheckMail$ = new Subject<boolean>();

@Component({
  selector: 'app-retrieve-password',
  templateUrl: './retrieve-password.component.html',
  styleUrls: ['./retrieve-password.component.css']
})
export class RetrievePasswordComponent implements OnInit {
  Mail:string="";
  MessageMail:string="";
  MessageOK:string="";
  MessageNOK:string="";
  constructor(private utilisateurService:UtilisateurDAL) { }

  ngOnInit(): void {
  }

  //Check du mail renseigné sur le champ correspondant (Format + Correct ou non)
  public VerifMail()
  {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.MessageMail = "";
    if (this.Mail == "") this.MessageMail = "Champ obligatoire.";
    else if (!re.test(this.Mail)) this.MessageMail = "Merci de saisir un E-mail au bon format."
    else this.utilisateurService.getUserByMail(this.Mail).subscribe(response => {
              CheckMail$.next(true);
            }, error =>{
              this.MessageMail = "Aucun compte n'est lié à cet E-mail.";
            });
  }

  //Méthode appelant API vers procédure stockée d'envoi d'un mail avec nouveau password généré.
  public GenererPassword()
  {
    this.VerifMail();
    zip(CheckMail$).subscribe(() => {
      if(this.MessageMail == '')
      {
        this.utilisateurService.GenerateAndSendNewPassword(this.Mail).subscribe(result => {
          this.MessageOK = "Votre nouveau mot de passe a été envoyé par E-mail. Pensez à vérifier vos spams!"
          setTimeout(()=> this.MessageOK ='', 5000);
          this.Mail = '';
        }, error => {
          this.MessageNOK = "Oops, une erreur est survenue. Veuillez réessayer plus tard ou contacter l'administrateur du site via le formulaire de contact."
          setTimeout(()=> this.MessageNOK ='', 5000);
        });
      }
    });
  }

  //Méthode appelant API vers procédure stockée d'envoi d'un mail avec pseudo actuel.
  public RetrouverPseudo()
  {
    this.VerifMail();
    zip(CheckMail$).subscribe(() => {
      if(this.MessageMail == '')
      {
        this.utilisateurService.FindUsernameByMail(this.Mail).subscribe(result => {
          this.MessageOK = "Votre pseudo a été envoyé par E-mail. Pensez à vérifier vos spams!"
          setTimeout(()=> this.MessageOK ='', 5000);
          this.Mail = '';
        }, error => {
          this.MessageNOK = "Oops, une erreur est survenue. Veuillez réessayer plus tard ou contacter l'administrateur du site via le formulaire de contact."
          setTimeout(()=> this.MessageNOK ='', 5000);
        });
      }
    });
  }
}
