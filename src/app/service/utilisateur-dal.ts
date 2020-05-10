import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Utilisateur } from "../models/utilisateur";
import { AppComponent } from '../app.component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class UtilisateurDAL {
    constructor(private http: HttpClient) { }
    GetAnonymeToken(){
      return this.http.get(EndPoint+'Login', this.GetHeader())
    }
    SetRoleAndActif(Id:number, Role:string, Actif:number, Token:string){
      return this.http.post(EndPoint+'Post API/Utilisateur/'+Id+'/?Role='+Role+'&Actif='+Actif , null, this.GetHeader(Token))
    }
    RetrouverPseudo(Mail:string, Token:string) {
      return this.http.post(EndPoint+'Login/?MailforPseudo='+Mail, null, this.GetHeader(Token))
    }
    GenererNouveauPassword(Mail:string, Token:string) {
      return this.http.post(EndPoint+'Login/?Mail='+Mail, null, this.GetHeader(Token))
    }
    changePassword(Id:number,NewPassword:string, Token:string) {
      return this.http.post(EndPoint+'Login/?IdUtilisateur='+Id, JSON.stringify(NewPassword), this.GetHeader(Token))
    }
    RenvoiToken(Id:number, Token:string) {
      console.log(Token);
      return this.http.post(EndPoint+'Login/?IdU='+Id, null, this.GetHeader(Token))
    }
    UpdateToken(Id:number, TokenAct:string, Token:string) {
      return this.http.post(EndPoint+'Login/'+Id, JSON.stringify(TokenAct), this.GetHeader(Token))
    }
    CheckUser(monObjet: Utilisateur, Token:string): Observable<string> {
      return this.http.post<string>(EndPoint+'Login', monObjet, this.GetHeader(Token))
    }
    getUtilisateurs(Token:string): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(EndPoint+'Utilisateur', this.GetHeader(Token))
    }
    getUtilisateur(id:number, Token:string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/'+id, this.GetHeader(Token))
    }
    getUtilisateurByPseudo(pseudo:string, Token:string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?pseudo='+pseudo, this.GetHeader(Token))
    }
    getUtilisateurByMail(mail:string, Token:string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?mail='+mail, this.GetHeader(Token));
    }
    postUtilisateur(monObjet: Utilisateur, Token:string): Observable<Utilisateur> {
        console.log("Passage postUtilisateur");
        return this.http.post<Utilisateur>(EndPoint+'Utilisateur', monObjet, this.GetHeader(Token))
    }
    putUtilisateur(monObjet: Utilisateur, id: number, Token:string): Observable<Utilisateur> {
        return this.http.put<Utilisateur>(EndPoint+'Utilisateur/'+id, monObjet, this.GetHeader(Token))
    }
    deleteUtilisateur(id: number, Token:string): Observable<Utilisateur> {
        return this.http.delete<Utilisateur>(EndPoint+'Utilisateur/'+id, this.GetHeader(Token))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      return throwError(errorMessage);
    }
    GetHeader(Token?:string)
    {
      let tok = Token??""
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization' : tok
        })
      };
      return httpOptions;
    }
}
