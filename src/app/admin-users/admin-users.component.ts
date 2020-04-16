import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Utilisateur } from '../models/utilisateur';
import { zip, Subject } from 'rxjs';

const Users$ = new Subject<boolean>();

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  constructor(private routerService:Router,private appService:AppComponent, private utilisateurService:UtilisateurDAL) { }
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

  ngOnInit(): void {
    if(!this.appService.data["TKA"] || ((this.appService.data["TK"].Role) && this.appService.data["TK"].Role != "Admin"))
    {
      this.routerService.navigateByUrl("/")
    }
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
  }

  search()
  {
    this.message = "";
    this.utilisateurService.getUtilisateurs(this.appService.data["TK"]).subscribe(result => {
      this.Users = result;
      Users$.next(true);
    })
    zip(Users$).subscribe(() => {
      this.Users = this.Users.filter(result => result.Role.includes(this.SearchRole) && result.Mail.includes(this.SearchMail) && result.Pseudo.includes(this.SearchPseudo))
      if (this.Users.length == 0) this.message = "Aucun Utilisateur trouvé.";
    });
  }

  changeRole(Role)
  {
    this.SearchRole = Role.value;
  }

  changeEditRole(Role)
  {
    this.EditRole = Role.value;
  }

  changeEditActif(Actif)
  {
    this.EditActif = Actif.value;
  }

  Edit(id)
  {
    this.edit = true;
    this.EditMail = this.Users.find(result => result.Id == id).Mail; 
    this.EditPseudo = this.Users.find(result => result.Id == id).Pseudo;
    this.EditActif = this.Users.find(result => result.Id == id).Actif;
    this.EditRole = this.Users.find(result => result.Id == id).Role;
    setTimeout(() => {
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

  Modifier()
  {
    this.EditUtil.Role = this.EditRole;
    this.EditUtil.Actif = this.EditActif;
    this.utilisateurService.putUtilisateur(this.EditUtil, this.EditUtil.Id, this.appService.data["TK"]).subscribe(() => {
      this.search();
    });
    this.edit = false;
  }
}
