import { Inject } from '@angular/core';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { Utilisateur } from '../models/utilisateur';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { ReplaySubject } from 'rxjs';
import { Favori } from '../models/favori';
import { Vote } from '../models/vote';
import { MesTeams } from '../models/mes-teams';

//Roles et infos utilitaires
const Anonyme = "Anonyme";
const User = "User";
const Info = "Info";
const Pseudo = "Pseudo";
const Id = "Id";
const Fav = "Fav";
const Votes = "Votes";
const Teams = "Teams";

export class AccessComponent {
    //Tableau reprenant les données en Session
    //Pas de lecture sur la Session en dehors de ce component
    //Permet récupération via le tableau et non directement via la session
    public data:any=[];
    
    CheckAno$ = new ReplaySubject<boolean>();

    constructor(private utilisateurService:UtilisateurDAL,@Inject(SESSION_STORAGE) private session: WebStorageService, private routerService:Router) { 
        if(this.session.get("TKA")) this.data[Anonyme] = this.session.get("TKA");
        if(this.session.get("TK")) this.data[User] = this.session.get("TK");
        if(this.session.get("User")) this.data[Info] = this.session.get("User");
        if(this.session.get("PseudoU")) this.data[Pseudo] = this.session.get("PseudoU");
        if(this.session.get("IdU")) this.data[Id] = this.session.get("IdU");
        if(this.session.get("Fav")) this.data[Fav] = this.session.get("Fav");
        if(this.session.get("Votes")) this.data[Votes] = this.session.get("Votes");
        if(this.session.get("Teams")) this.data[Teams] = this.session.get("Teams");
    }

    //Permet de checker le droit d'accès aux pages
    //La variable {role} à renseigner et celle de plus haut niveau : Admin -> User -> Anonyme
    //role Activation = cas particulier uniquement lors du check si la personne qui se log a activé son compte
    public CheckAccess(role)
    {
        if(role == "Anonyme" && !this.getSession("Anonyme")) this.routerService.navigateByUrl("/");
        else if(role == "User" && (!this.getSession("Anonyme") || !this.getSession("User"))) this.routerService.navigateByUrl("/");
        else if(role == "Admin" && (!this.getSession("Anonyme") || !this.getSession("User") || !this.getSession("Info") || this.getSession("Info").Role != "Admin")) this.routerService.navigateByUrl("/");
        else if(role == "Activation" && (!this.getSession("Anonyme") || !this.getSession("Pseudo") || !this.getSession("Id"))) this.routerService.navigateByUrl("/");
    }

    public CheckAccessTest(role):boolean
    {
        if(role == "Anonyme" && !this.getSession("Anonyme")) return false;
        else if(role == "User" && (!this.getSession("Anonyme") || !this.getSession("User"))) return false;
        else if(role == "Admin" && (!this.getSession("Anonyme") || !this.getSession("User") || !this.getSession("Info") || this.getSession("Info").Role != "Admin")) return false;
        else if(role == "Activation" && (!this.getSession("Anonyme") || !this.getSession("Pseudo") || !this.getSession("Id"))) return false;
        else return true;
    }

    //Récupération des infos de session (via tableau data[])
    public getSession(Token:string):any
    {
        let result;
        switch(Token) {
            case Anonyme : { result = this.data[Anonyme]; break;}
            case User : { result = this.data[User]; break;}
            case Info : { result = this.data[Info]; break;}
            case Pseudo : { result = this.data[Pseudo]; break;}
            case Id : { result = this.data[Id]; break;}
            case Fav : { result = this.data[Fav]; break;}
            case Votes : { result = this.data[Votes]; break;}
            case Teams : { result = this.data[Teams]; break;}
        }
        return result;
    }

    public pushToSession(Token:string, Data:any):void
    {
        switch(Token) {
            case Fav : { 
                this.data[Fav].push(Data);
                this.session.set("Fav", this.data[Fav]);
                break;}
            case Votes : { 
                this.data[Votes].push(Data);
                this.session.set("Votes", this.data[Votes]);
                break;}
            case Teams : { 
                this.data[Teams].push(Data);
                this.session.set("Teams", this.data[Teams]);
                break;}
        }
    }

    //Ecriture valeur en session + copie dans tableau data[]
    public setSession(Token:string, Data:any):void
    {
        switch(Token) {
            case Anonyme : { 
                this.session.set("TKA", Data as string);
                this.data[Anonyme] = this.session.get("TKA");
                break;}
            case User : { 
                this.session.set("TK", Data as string);
                this.data[User] = this.session.get("TK");
                break;}
            case Info : { 
                this.session.set("User", Data as Utilisateur);
                this.data[Info]= this.session.get("User");
                break;}
            case Pseudo : { 
                this.session.set("PseudoU", Data as string);
                this.data[Pseudo]= this.session.get("PseudoU");
                break;}
            case Id : { 
                this.session.set("IdU", Data as string);
                this.data[Id]= this.session.get("IdU");
                break;}
            case Fav : { 
                this.session.set("Fav", Data as Favori[]);
                this.data[Fav]= this.session.get("Fav");
                break;}
            case Votes : { 
                this.session.set("Votes", Data as Vote[]);
                this.data[Votes]= this.session.get("Votes");
                break;}
            case Teams : { 
                this.session.set("Teams", Data as MesTeams[]);
                this.data[Teams]= this.session.get("Teams");
                break;}
        }
    }

    //Suppression d'infos en session + du tableau local data
    public deleteSession(Token:string):void
    {
        switch(Token) {
            case Anonyme : { 
                this.session.remove("TKA");
                delete this.data[Anonyme];
                break;}
            case User : { 
                this.session.remove("TK");
                delete this.data[User];
                break;}
            case Info : { 
                this.session.remove("User");
                delete this.data[Info];
                break;}
            case Pseudo : { 
                this.session.remove("PseudoU");
                delete this.data[Pseudo]; 
                break;}
            case Id : { 
                this.session.remove("IdU");
                delete this.data[Id];
                break;}
            case Votes : { 
                this.session.remove("Votes");
                delete this.data[Votes];
                break;}
            case Fav : { 
                this.session.remove("Fav");
                delete this.data[Fav];
                break;}
            case Teams : { 
                this.session.remove("Teams");
                delete this.data[Teams];
                break;}
            case "All" : {
                this.deleteSession(Teams);
                this.deleteSession(Fav);
                this.deleteSession(Votes);
                this.deleteSession(Id);
                this.deleteSession(Pseudo);
                this.deleteSession(User);
                this.deleteSession(Info);
                break;}
        }
    }

    //Récupération du JWT Anonyme + Envoi passage Subject à true pour utilisation dans les components
    getAnonymeKey()
    {
        if (!this.data[Anonyme])
        {
            this.utilisateurService.GetAnonymeToken().subscribe(result => {
                this.data[Anonyme] = result;
                this.setSession(Anonyme, result);
                this.CheckAno$.next(true);
            });
        }
        else this.CheckAno$.next(false);
    }
}
