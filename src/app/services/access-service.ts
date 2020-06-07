import { Inject } from '@angular/core';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { UserService } from './user-service';

//Const used for differentes Session variable
const Anonyme = "Anonymous";
const User = "User";
const Info = "Info";
const Pseudo = "Pseudo";
const Id = "Id";
const Fav = "Fav";
const Votes = "Votes";
const Teams = "Teams";
const Lang = "Language"

export class AccessService {

    constructor(private userService:UserService,@Inject(SESSION_STORAGE) private session: WebStorageService, private routerService:Router) { }

    /** Checking access right to component depending on differents role (used in other helpeur for canActivate function)
     * @param role Role of the checked for access to pages
    */
    public CheckAccess(role):boolean
    {
        if(role == "Anonymous" && !this.getSession("Anonymous")) return false;
        else if(role == "User" && (!this.getSession("Anonymous") || !this.getSession("User"))) return false;
        else if(role == "Admin" && (!this.getSession("Anonymous") || !this.getSession("User") || !this.getSession("Info") || this.getSession("Info").Role != "Admin")) return false;
        else if(role == "Activation" && (!this.getSession("Anonymous") || !this.getSession("Pseudo") || !this.getSession("Id"))) return false;
        else return true;
    }

    /** Get info from session 
     * @param Token Variable to get
    */
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
            case Lang : { 
                result = this.session.get(Lang); 
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
                result.push(this.session.get(Lang));
                break;}
        }
        return result;
    }

    /** Write on session 
     * @param Token Variable to write
     * @param Data Data to insert in variable
    */
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
            case Lang : { 
                this.session.set(Lang, Data);
                break;}
        }
    }

    /** Delete from session 
     * @param Token Variable to remove
    */
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
            case Lang : { 
                this.session.remove(Lang);
                break;}
            case "All" : {
                this.deleteSession(Teams);
                this.deleteSession(Fav);
                this.deleteSession(Votes);
                this.deleteSession(Id);
                this.deleteSession(Pseudo);
                this.deleteSession(User);
                this.deleteSession(Info);
                this.deleteSession(Lang);
                break;}
        }
    }

    /** Get Anonymous token and set session */
    getAnonymeKey()
    {
        this.deleteSession("All");
        this.userService.GetAnonymeToken().subscribe(result => {
            this.setSession(Anonyme, result);
        });
    }
}
