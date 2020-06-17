import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient,private accessService:AccessService) { }
  
  /**
  * Call to API to get an anonymous JWT token
  */
  GetAnonymeToken() {
    return this.http.get(environement.API+'Login', this.Header())
  }
  /**
  * Call to API to update Role and Actif state of a user
  * @param Id ID of the user 
  * @param Id Role of the user 
  * @param Id Actif of the user 
  */
  SetRoleAndActive(Id:number, Role:string, Actif:number) {
    return this.http.post(environement.API+'User/'+Id+'/Role='+Role+'/Actif='+Actif , null, this.Header())
  }
  /**
  * Call to API to Find an existing use depending on Mail
  * @param Mail E-mail
  */
  FindUsernameByMail(Mail:string) {
    return this.http.post(environement.API+'Login/MailforUsername='+Mail, null, this.Header())
  }
  /**
  * Call to API to send new password by e-mail
  * @param Mail E-mail
  */
  GenerateAndSendNewPassword(Mail:string) {
    return this.http.post(environement.API+'Login/Mail='+Mail, null, this.Header())
  }
  /**
  * Call to API to update password of a user
  * @param Id User Id
  * @param NewPassword NewPassword
  */
  changePassword(Id:number,NewPassword:string) {
    return this.http.post(environement.API+'Login/IdUser='+Id, JSON.stringify(NewPassword), this.Header())
  }
  /**
  * Call to API to send new activation token by e-mail
  * @param Id Id of the user
  */
  ResendToken(Id:number) {
    return this.http.post(environement.API+'Login/IdU='+Id, null, this.Header())
  }
  /**
  * Call to API to update activation Token send by user (to null in DB)
  * @param Id Id of the user
  * @param TokenAct Activation Token filled in by user
  */
  UpdateActivationToken(Id:number, TokenAct:string) {
    return this.http.post(environement.API+'Login/'+Id, JSON.stringify(TokenAct), this.Header())
  }
  /**
  * Call to API to check if username and password match
  * @param User User filled in with username and password
  */
  CheckUser(User: User): Observable<string> {
    return this.http.post<string>(environement.API+'Login', User, this.Header())
  }
  /**
  * Call to API to get all users
  * @return Observable<User[]>
  */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environement.API+'User', this.Header())
  }
  /**
  * Call to API to get a users depending on his id
  * @param id User's id
  * @return Observable<User>
  */
  getUser(id:number): Observable<User> {
    return this.http.get<User>(environement.API+'User/'+id, this.Header())
  }
  /**
  * Call to API to get a users depending on his id (also show inactive one's on DB)
  * @param id User's id
  * @return Observable<User>
  */
  getUserAdmin(id:number): Observable<User> {
    return this.http.get<User>(environement.API+'Admin/'+id, this.Header())
  }
  /**
  * Call to API to get a users depending on his username
  * @param username User's username
  * @return Observable<User>
  */
  getUserByPseudo(username:string): Observable<User> {
    return this.http.get<User>(environement.API+'User/username='+username, this.Header())
  }
  /**
  * Call to API to get a users depending on his email
  * @param email User's email
  * @return Observable<User>
  */
  getUserByMail(email:string): Observable<User> {
    return this.http.get<User>(environement.API+'User/mail='+email, this.Header());
  }
  /**
  * Call to API to post a new user
  * @param user User
  * @return Observable<User>
  */
  postUser(user: User): Observable<User> {
    return this.http.post<User>(environement.API+'User', user, this.Header())
  }
  /**
  * Call to API to edit a user
  * @param user User
  * @param id User's id
  * @return Observable<User>
  */
  putUserById(user: User, id: number): Observable<User> {
    return this.http.put<User>(environement.API+'User/'+id, user, this.Header())
  }
  /**
  * Call to API to delete a user
  * @param id User's id
  * @return Observable<User>
  */
  deleteUserById(id: number): Observable<User> {
    return this.http.delete<User>(environement.API+'User/'+id, this.Header())
  }
  /**
  * Create the httpOptions header with Authorization
  * @returns httpOptions
  */
  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonymous")??""
    })};
    return httpOptions;
  }

}