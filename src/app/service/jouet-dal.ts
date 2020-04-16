import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Jouet } from "../models/jouet";

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class JouetDAL {
    constructor(private http: HttpClient) { }
    getJouets(Token:string): Observable<Jouet[]> {
        return this.http.get<Jouet[]>(EndPoint+'Jouet', this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    getJouet(id:number, Token:string): Observable<Jouet> {
        return this.http.get<Jouet>(EndPoint+'Jouet/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    postJouet(monObjet: Jouet, Token:string): Observable<Jouet> {
        return this.http.post<Jouet>(EndPoint+'Jouet', monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    putJouet(monObjet: Jouet, id: number, Token:string): Observable<Jouet> {
        return this.http.put<Jouet>(EndPoint+'Jouet/'+id, monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    deleteJouet(id: number, Token:string): Observable<Jouet> {
        return this.http.delete<Jouet>(EndPoint+'Jouet/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
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
