import { Component, OnInit } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Utilisateur } from '../models/utilisateur';
import { zip, Subject } from 'rxjs';
import { AccessComponent } from '../helpeur/access-component';

const Users$ = new Subject<boolean>();
const CheckMail$ = new Subject<boolean>();
const CheckPseudo$ = new Subject<boolean>();

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  constructor(private accessService:AccessComponent, private utilisateurService:UtilisateurDAL) { }
  Users:Utilisateur[];
  SearchMail:string;
  SearchPseudo:string;
  SearchRole:string;
  SelectRole:string[];
  message:string;
  edit:boolean;
  EditMail:string;
  EditPseudo:string;
  EditRole:string;
  EditActif:number;
  EditUtil:Utilisateur;
  messageError:string;
  messageValidation:string;
  messageEchec:string;

  ngOnInit(): void {
    this.accessService.CheckAccess("Admin");
    this.edit = false;
    this.Users = new Array<Utilisateur>();
    this.SelectRole = ["User", "Admin"];
    this.SearchRole="";
    this.SearchPseudo="";
    this.SearchMail="";
    this.message = "";
    this.EditMail = "";
    this.EditPseudo = "";
    this.EditRole = "";
    this.EditActif = 1;
    this.messageError = "";
    this.messageValidation ="";
    this.messageEchec = "";
  }

  search()
  {
    this.message = "";
    this.utilisateurService.getUtilisateurs(this.accessService.data["User"]).subscribe(result => {
      this.Users = result;
      Users$.next(true);
    })
    zip(Users$).subscribe(() => {
      //filter utilisé pour filtrer la liste en fonction du choix via liste déroulante (Valeur par défaut mise en place)
      this.Users = this.Users.filter(result => result.Role.includes(this.SearchRole) && result.Mail.includes(this.SearchMail) && result.Pseudo.includes(this.SearchPseudo))
      if (this.Users.length == 0) this.message = "Aucun Utilisateur trouvé.";
    });
  }

  //Assignation valeur du Role, sélection via liste déroulante (Valeur par défaut = User) pour la recherche
  changeRole(Role) { this.SearchRole = Role.value; }

  //Assignation valeur du Role lors d'une édition d'un utilisateur existant, sélection via liste déroulante
  changeEditRole(Role) { this.EditRole = Role.value; }

  //Assignation valeur "Actif" lors d'une édition d'un utilisateur existant, sélection via liste déroulante
  changeEditActif(Actif) { this.EditActif = Actif.value; }

  //Remplissage auto des champs lors de sélection d'édition.
  Edit(id)
  {
    this.edit = true;
    this.EditMail = this.Users.find(result => result.Id == id).Mail; 
    this.EditPseudo = this.Users.find(result => result.Id == id).Pseudo;
    this.EditActif = this.Users.find(result => result.Id == id).Actif;
    this.EditRole = this.Users.find(result => result.Id == id).Role;
    //Utilisation du timeout pour laisser le temps de remplir les variables ci-avant.
    //Solution à trouvé avec un zip.
    setTimeout(() => {
    //bis repatita, c'est moche mais ça marche. Solution à trouver pour améliorer.
    let myRoleSelect = (document.getElementById("R") as HTMLSelectElement);
      for(var i, j = 0; i = myRoleSelect.options[j]; j++) {
        if(i.value == this.EditRole) {
          myRoleSelect.selectedIndex = j;
            break;
        }
      }
      let myActifSelect = (document.getElementById("A") as HTMLSelectElement);
      for(var i, j = 0; i = myActifSelect.options[j]; j++) {
        if(i.value == this.EditActif) {
          myActifSelect.selectedIndex = j;
            break;
        }
      }
    },100);
    this.EditUtil = new Utilisateur({
      Id : id,
      Pseudo : this.EditPseudo,
      Mail: this.EditMail,
      Role : this.EditRole,
      Actif : this.EditActif
    })
  }

  //Envoi des modifications suite à édition via API.
  Modifier()
  {
    this.EditUtil.Mail = this.EditMail;
    this.EditUtil.Pseudo = this.EditPseudo;
    this.EditUtil.Role = this.EditRole;
    this.EditUtil.Actif = this.EditActif;
    this.CheckPseudo(this.EditUtil.Pseudo, this.EditUtil.Id);
    this.CheckMail(this.EditUtil.Mail, this.EditUtil.Id);
    zip(CheckPseudo$, CheckMail$).subscribe(([Pseudo,Mail]) => {
      if(!Pseudo) this.messageError = "Ce pseudo existe déjà sur un autre utilisateur";
      else if(!Mail) this.messageError = "Ce Mail existe déjà sur un autre utilisateur";
      else {
        this.messageError = "";
        this.edit = false;
        this.utilisateurService.putUtilisateur(this.EditUtil, this.EditUtil.Id, this.accessService.data["User"]).subscribe(() => {
          this.messageValidation = "Le changement a été effectué avec succès.";
          this.search();
          setTimeout(() => { this.messageValidation=""; },4000)
        }, error => {
          this.messageEchec = "La mise à jour n'a pas fonctionnée. Tu es nul en tant qu'admin.";
          setTimeout(() => { this.messageEchec=""; },4000)
        });
      } 
    });
  }

  //Vérification si pseudo existe déjà lors de l'édition.
  public CheckPseudo(Pseudo:string, Id:number)
  {
    this.utilisateurService.getUtilisateurByPseudo(Pseudo, this.accessService.data["User"]).subscribe(result => {
      if(result.Id == Id) CheckPseudo$.next(true);
      else CheckPseudo$.next(false);
    }, error => {
      CheckPseudo$.next(true);
    })
  }

  //Vérification si mail existe déjà lors de l'édition.
  public CheckMail(Mail:string, Id:number)
  {
    this.utilisateurService.getUtilisateurByMail(Mail, this.accessService.data["User"]).subscribe(result => {
      if(result.Id == Id) CheckMail$.next(true);
      else CheckMail$.next(false);
    }, error => {
      CheckMail$.next(true);
    })
  }
}
