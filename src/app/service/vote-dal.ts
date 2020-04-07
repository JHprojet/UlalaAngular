import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Vote } from "../models/vote";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class VoteDAL {
    constructor(private http: HttpClient) { }
    getVotes(): Observable<Vote[]> {
        return this.http.get<Vote[]>(EndPoint+'Vote').pipe(retry(1), catchError(this.handleError))
    }
    getVote(id:number): Observable<Vote> {
        return this.http.get<Vote>(EndPoint+'Vote/'+id).pipe(retry(1), catchError(this.handleError))
    }
    getVotesByUser(id:number): Observable<Vote[]> {
      return this.http.get<Vote[]>(EndPoint+'Vote/?UtilisateurId='+id).pipe(retry(1), catchError(this.handleError))
  }
    postVote(monObjet: Vote): Observable<Vote> {
        return this.http.post<Vote>(EndPoint+'Vote', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putVote(monObjet: Vote, id: number): Observable<Vote> {
        return this.http.put<Vote>(EndPoint+'Vote/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteVote(id: number): Observable<Vote> {
        return this.http.delete<Vote>(EndPoint+'Vote/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
