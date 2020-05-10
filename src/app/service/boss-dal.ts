import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Boss } from "../models/boss";

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })

export class BossDAL {
    constructor(private http: HttpClient) { }
    getBosses(Token:string): Observable<Boss[]> {
        return this.http.get<Boss[]>(EndPoint+'Boss', this.GetHeader(Token))
    }
    getBoss(id:number, Token:string): Observable<Boss> {
        return this.http.get<Boss>(EndPoint+'Boss/'+id, this.GetHeader(Token))
    }
    postBoss(monObjet: Boss, Token:string): Observable<Boss> {
        return this.http.post<Boss>(EndPoint+'Boss', monObjet, this.GetHeader(Token))
    }
    putBoss(monObjet: Boss, id: number, Token:string): Observable<Boss> {
        return this.http.put<Boss>(EndPoint+'Boss/'+id, monObjet, this.GetHeader(Token))
    }
    deleteBoss(id: number, Token:string): Observable<Boss> {
        return this.http.delete<Boss>(EndPoint+'Boss/'+id, this.GetHeader(Token))
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
