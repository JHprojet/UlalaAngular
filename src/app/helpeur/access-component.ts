import { Inject } from '@angular/core';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Subject } from 'rxjs';

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

    CheckAno$ = new Subject<boolean>();

    constructor(private utilisateurService:UtilisateurDAL,@Inject(SESSION_STORAGE) private session: WebStorageService, private routerService:Router) { }

    //Permet de checker le droit d'accès aux pages
    //La variable {role} à renseigner et celle de plus haut niveau : Admin -> User -> Anonyme
    //role Activation = cas particulier uniquement lors du check si la personne qui se log a activé son compte
    public CheckAccess(role):boolean
    {
        if(role == "Anonyme" && !this.getSession("Anonyme")) return false;
        else if(role == "User" && (!this.getSession("Anonyme") || !this.getSession("User"))) return false;
        else if(role == "Admin" && (!this.getSession("Anonyme") || !this.getSession("User") || !this.getSession("Info") || this.getSession("Info").Role != "Admin")) return false;
        else if(role == "Activation" && (!this.getSession("Anonyme") || !this.getSession("Pseudo") || !this.getSession("Id"))) return false;
        else return true;
    }

    //Récupération des infos de session
    public getSession(Token:string):any
    { 
        let result;
        switch(Token) {
            case Anonyme : { 
                result = this.session.get(Anonyme); 
                break;
            }
            case User : { 
                result = this.session.get(User); 
                break;}
            case Info : { 
                result = this.session.get(Info); 
                break;}
            case Pseudo : { 
                result = this.session.get(Pseudo); 
                break;}
            case Id : { 
                result = this.session.get(Id); 
                break;}
            case Fav : { 
                result = this.session.get(Fav); 
                break;}
            case Votes : { 
                result = this.session.get(Votes); 
                break;}
            case Teams : { 
                result = this.session.get(Teams); 
                break;}
            case "All" : {
                result = new Array();
                result.push(this.session.get(Anonyme));
                result.push(this.session.get(User));
                result.push(this.session.get(Info));
                result.push(this.session.get(Pseudo));
                result.push(this.session.get(Id));
                result.push(this.session.get(Fav));
                result.push(this.session.get(Votes));
                result.push(this.session.get(Teams));
                break;}
        }
        return result;
    }

    //Ecriture valeur en session + copie dans tableau data[]
    public setSession(Token:string, Data:any):void
    {
        switch(Token) {
            case Anonyme : { 
                this.session.set(Anonyme, Data);
                break;}
            case User : { 
                this.session.set(User, Data);
                break;}
            case Info : { 
                this.session.set(Info, Data);
                break;}
            case Pseudo : { 
                this.session.set(Pseudo, Data);
                break;}
            case Id : { 
                this.session.set(Id, Data);
                break;}
            case Fav : { 
                this.session.set(Fav, Data);
                break;}
            case Votes : { 
                this.session.set(Votes, Data);
                break;}
            case Teams : { 
                this.session.set(Teams, Data);
                break;}
        }
    }

    //Suppression d'infos en session + du tableau local data
    public deleteSession(Token:string):void
    {
        switch(Token) {
            case Anonyme : { 
                this.session.remove(Anonyme);
                break;}
            case User : { 
                this.session.remove(User);
                break;}
            case Info : { 
                this.session.remove(Info);
                break;}
            case Pseudo : { 
                this.session.remove(Pseudo); 
                break;}
            case Id : { 
                this.session.remove(Id);
                break;}
            case Votes : { 
                this.session.remove(Votes);
                break;}
            case Fav : { 
                this.session.remove(Fav);
                break;}
            case Teams : { 
                this.session.remove(Teams);
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
        this.utilisateurService.GetAnonymeToken().subscribe(result => {
            this.setSession(Anonyme, result);
        });
    }
}
