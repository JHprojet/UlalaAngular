import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Utilisateur } from "../models/utilisateur";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class UtilisateurDAL {
    constructor(private http: HttpClient) { }
    RenvoiToken(Id:number) {
      return this.http.post(EndPoint+'Login/?IdU='+Id, httpOptions).pipe(catchError(this.handleError))
    }
    UpdateToken(Id:number, Token:string) {
      return this.http.post(EndPoint+'Login/'+Id+'/?Token='+Token, httpOptions).pipe(catchError(this.handleError))
    }
    CheckUser(monObjet: Utilisateur): Observable<Utilisateur> {
      return this.http.post<Utilisateur>(EndPoint+'Login', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    getUtilisateurs(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(EndPoint+'Utilisateur').pipe(catchError(this.handleError))
    }
    getUtilisateur(id:number): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/'+id).pipe(catchError(this.handleError))
    }
    getUtilisateurByPseudo(pseudo:string): Observable<HttpResponse<Utilisateur>> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?pseudo='+pseudo, { observe: 'response' }).pipe(catchError(this.handleError))
    }
    getUtilisateurByMail(mail:string): Observable<HttpResponse<Utilisateur>> {
        return this.http.get<Utilisateur>(EndPoint+'Utilisateur/?mail='+mail, { observe: 'response' }).pipe(catchError(this.handleError));
    }
    postUtilisateur(monObjet: Utilisateur): Observable<Utilisateur> {
        return this.http.post<Utilisateur>(EndPoint+'Utilisateur', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putUtilisateur(monObjet: Utilisateur, id: number): Observable<Utilisateur> {
        return this.http.put<Utilisateur>(EndPoint+'Utilisateur/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteUtilisateur(id: number): Observable<Utilisateur> {
        return this.http.delete<Utilisateur>(EndPoint+'Utilisateur/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      return throwError(errorMessage);
    }
}
