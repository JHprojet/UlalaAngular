import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Utilisateur } from "../models/utilisateur";
import { AppComponent } from '../app.component';
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class UtilisateurDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  GetAnonymeToken(){
    return this.http.get(EndPoint+'Login', this.httpOptions)
  }
  SetRoleAndActif(Id:number, Role:string, Actif:number){
    return this.http.post(EndPoint+'Post API/Utilisateur/'+Id+'/?Role='+Role+'&Actif='+Actif , null, this.httpOptions)
  }
  RetrouverPseudo(Mail:string) {
    return this.http.post(EndPoint+'Login/?MailforPseudo='+Mail, null, this.httpOptions)
  }
  GenererNouveauPassword(Mail:string) {
    return this.http.post(EndPoint+'Login/?Mail='+Mail, null, this.httpOptions)
  }
  changePassword(Id:number,NewPassword:string) {
    return this.http.post(EndPoint+'Login/?IdUtilisateur='+Id, JSON.stringify(NewPassword), this.httpOptions)
  }
  RenvoiToken(Id:number) {
    return this.http.post(EndPoint+'Login/?IdU='+Id, null, this.httpOptions)
  }
  UpdateToken(Id:number, TokenAct:string) {
    return this.http.post(EndPoint+'Login/'+Id, JSON.stringify(TokenAct), this.httpOptions)
  }
  CheckUser(monObjet: Utilisateur): Observable<string> {
    return this.http.post<string>(EndPoint+'Login', monObjet, this.httpOptions)
  }
  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(EndPoint+'Utilisateur', this.httpOptions)
  }
  getUtilisateur(id:number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/'+id, this.httpOptions)
  }
  getUtilisateurByPseudo(pseudo:string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?pseudo='+pseudo, this.httpOptions)
  }
  getUtilisateurByMail(mail:string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?mail='+mail, this.httpOptions);
  }
  postUtilisateur(monObjet: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(EndPoint+'Utilisateur', monObjet, this.httpOptions)
  }
  putUtilisateur(monObjet: Utilisateur, id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(EndPoint+'Utilisateur/'+id, monObjet, this.httpOptions)
  }
  deleteUtilisateur(id: number): Observable<Utilisateur> {
    return this.http.delete<Utilisateur>(EndPoint+'Utilisateur/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
