import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Utilisateur } from "../models/utilisateur";
import { AccessComponent } from '../helpeur/access-component';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class UtilisateurDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  
  GetAnonymeToken() {
    return this.http.get(EndPoint+'Login', this.Header())
  }
  SetRoleAndActif(Id:number, Role:string, Actif:number) {
    return this.http.post(EndPoint+'Post API/Utilisateur/'+Id+'/?Role='+Role+'&Actif='+Actif , null, this.Header())
  }
  FindUsernameByMail(Mail:string) {
    return this.http.post(EndPoint+'Login/?MailforPseudo='+Mail, null, this.Header())
  }
  GenerateAndSendNewPassword(Mail:string) {
    return this.http.post(EndPoint+'Login/?Mail='+Mail, null, this.Header())
  }
  changePassword(Id:number,NewPassword:string) {
    return this.http.post(EndPoint+'Login/?IdUtilisateur='+Id, JSON.stringify(NewPassword), this.Header())
  }
  ResendToken(Id:number) {
    return this.http.post(EndPoint+'Login/?IdU='+Id, null, this.Header())
  }
  UpdateActivationToken(Id:number, TokenAct:string) {
    return this.http.post(EndPoint+'Login/'+Id, JSON.stringify(TokenAct), this.Header())
  }
  CheckUser(monObjet: Utilisateur): Observable<string> {
    return this.http.post<string>(EndPoint+'Login', monObjet, this.Header())
  }
  getUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(EndPoint+'Utilisateur', this.Header())
  }
  getUser(id:number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/'+id, this.Header())
  }
  getUserAdmin(id:number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Admin/'+id, this.Header())
  }
  getUserByPseudo(pseudo:string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?pseudo='+pseudo, this.Header())
  }
  getUserByMail(mail:string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?mail='+mail, this.Header());
  }
  postUser(monObjet: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(EndPoint+'Utilisateur', monObjet, this.Header())
  }
  putUserById(monObjet: Utilisateur, id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(EndPoint+'Utilisateur/'+id, monObjet, this.Header())
  }
  deleteUserById(id: number): Observable<Utilisateur> {
    return this.http.delete<Utilisateur>(EndPoint+'Utilisateur/'+id, this.Header())
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }

  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })};
    return httpOptions;
  }

}