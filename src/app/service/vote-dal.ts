import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Vote } from "../models/vote";

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class VoteDAL {
    constructor(private http: HttpClient) { }
    getVotes(Token:string): Observable<Vote[]> {
        return this.http.get<Vote[]>(EndPoint+'Vote', this.GetHeader(Token)).pipe(retry(1), catchError(this.handleError))
    }
    getVote(id:number, Token:string): Observable<Vote> {
        return this.http.get<Vote>(EndPoint+'Vote/'+id, this.GetHeader(Token)).pipe(retry(1), catchError(this.handleError))
    }
    getVotesByUser(id:number, Token:string): Observable<Vote[]> {
      return this.http.get<Vote[]>(EndPoint+'Vote/?UtilisateurId='+id, this.GetHeader(Token))
  }
    postVote(monObjet: Vote, Token:string): Observable<Vote> {
        return this.http.post<Vote>(EndPoint+'Vote', monObjet, this.GetHeader(Token))
    }
    putVote(monObjet: Vote, id: number, Token:string): Observable<Vote> {
        return this.http.put<Vote>(EndPoint+'Vote/'+id, monObjet, this.GetHeader(Token))
    }
    deleteVote(id: number, Token:string): Observable<Vote> {
        return this.http.delete<Vote>(EndPoint+'Vote/'+id, this.GetHeader(Token))
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
