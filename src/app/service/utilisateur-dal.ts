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
      return this.http.get(EndPoint+'Login', this.GetHeader()).pipe(catchError(this.handleError))
    }
    RetrouverPseudo(Mail:string, Token:string) {
      return this.http.post(EndPoint+'Login/?MailforPseudo='+Mail, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    GenererNouveauPassword(Mail:string, Token:string) {
      return this.http.post(EndPoint+'Login/?Mail='+Mail, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    changePassword(Id:number,NewPassword:string, Token:string) {
      return this.http.post(EndPoint+'Login/?IdUtilisateur='+Id, JSON.stringify(NewPassword), this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    RenvoiToken(Id:number, Token:string) {
      return this.http.post(EndPoint+'Login/?IdU='+Id, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    UpdateToken(Id:number, TokenAct:string, Token:string) {
      return this.http.post(EndPoint+'Login/'+Id+'/?Token='+TokenAct, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    CheckUser(monObjet: Utilisateur, Token:string): Observable<string> {
      return this.http.post<string>(EndPoint+'Login', monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    getUtilisateurs(Token:string): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(EndPoint+'Utilisateur', this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    getUtilisateur(id:number, Token:string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    getUtilisateurByPseudo(pseudo:string, Token:string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?pseudo='+pseudo, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    getUtilisateurByMail(mail:string, Token:string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?mail='+mail, this.GetHeader(Token)).pipe(catchError(this.handleError));
    }
    postUtilisateur(monObjet: Utilisateur, Token:string): Observable<Utilisateur> {
        return this.http.post<Utilisateur>(EndPoint+'Utilisateur', monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    putUtilisateur(monObjet: Utilisateur, id: number, Token:string): Observable<Utilisateur> {
        return this.http.put<Utilisateur>(EndPoint+'Utilisateur/'+id, monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    deleteUtilisateur(id: number, Token:string): Observable<Utilisateur> {
        return this.http.delete<Utilisateur>(EndPoint+'Utilisateur/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
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
