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
  
  /**
  * Call to API to get an anonymous JWT token
  * @returns Observable<Object>
  */
  GetAnonymeToken() {
    return this.http.get(EndPoint+'Login', this.Header())
  }
  /**
  * Call to API to update Role and Actif state of a user
  * @param Id ID of the user 
  * @param Id Role of the user 
  * @param Id Actif of the user 
  */
  SetRoleAndActif(Id:number, Role:string, Actif:number) {
    return this.http.post(EndPoint+'Post API/Utilisateur/'+Id+'/?Role='+Role+'&Actif='+Actif , null, this.Header())
  }
  /**
  * Call to API to Find an existing use depending on Mail
  * @param Mail E-mail
  */
  FindUsernameByMail(Mail:string) {
    return this.http.post(EndPoint+'Login/?MailforPseudo='+Mail, null, this.Header())
  }
  /**
  * Call to API to send new password by e-mail
  * @param Mail E-mail
  */
  GenerateAndSendNewPassword(Mail:string) {
    return this.http.post(EndPoint+'Login/?Mail='+Mail, null, this.Header())
  }
  /**
  * Call to API to update password of a user
  * @param Id User Id
  * @param NewPassword NewPassword
  */
  changePassword(Id:number,NewPassword:string) {
    return this.http.post(EndPoint+'Login/?IdUtilisateur='+Id, JSON.stringify(NewPassword), this.Header())
  }
  /**
  * Call to API to send new activation token by e-mail
  * @param Id Id of the user
  */
  ResendToken(Id:number) {
    return this.http.post(EndPoint+'Login/?IdU='+Id, null, this.Header())
  }
  /**
  * Call to API to update activation Token send by user (to null in DB)
  * @param Id Id of the user
  * @param TokenAct Activation Token filled in by user
  */
  UpdateActivationToken(Id:number, TokenAct:string) {
    return this.http.post(EndPoint+'Login/'+Id, JSON.stringify(TokenAct), this.Header())
  }
  /**
  * Call to API to check if username and password match
  * @param Utilisateur User filled in with username and password
  */
  CheckUser(Utilisateur: Utilisateur): Observable<string> {
    return this.http.post<string>(EndPoint+'Login', Utilisateur, this.Header())
  }
  /**
  * Call to API to get all users
  * @return Observable<Utilisateur[]>
  */
  getUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(EndPoint+'Utilisateur', this.Header())
  }
  /**
  * Call to API to get a users depending on his id
  * @param id User's id
  * @return Observable<Utilisateur>
  */
  getUser(id:number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/'+id, this.Header())
  }
  /**
  * Call to API to get a users depending on his id (also show inactive one's on DB)
  * @param id User's id
  * @return Observable<Utilisateur>
  */
  getUserAdmin(id:number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Admin/'+id, this.Header())
  }
  /**
  * Call to API to get a users depending on his username
  * @param username User's username
  * @return Observable<Utilisateur>
  */
  getUserByPseudo(username:string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?pseudo='+username, this.Header())
  }
  /**
  * Call to API to get a users depending on his email
  * @param email User's email
  * @return Observable<Utilisateur>
  */
  getUserByMail(email:string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?mail='+email, this.Header());
  }
  /**
  * Call to API to post a new user
  * @param user Utilisateur
  * @return Observable<Utilisateur>
  */
  postUser(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(EndPoint+'Utilisateur', user, this.Header())
  }
  /**
  * Call to API to edit a user
  * @param user Utilisateur
  * @param id User's id
  * @return Observable<Utilisateur>
  */
  putUserById(user: Utilisateur, id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(EndPoint+'Utilisateur/'+id, user, this.Header())
  }
  /**
  * Call to API to delete a user
  * @param id User's id
  * @return Observable<Utilisateur>
  */
  deleteUserById(id: number): Observable<Utilisateur> {
    return this.http.delete<Utilisateur>(EndPoint+'Utilisateur/'+id, this.Header())
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
  /**
  * Create the httpOptions header with Authorization
  * @returns httpOptions
  */
  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })};
    return httpOptions;
  }

}