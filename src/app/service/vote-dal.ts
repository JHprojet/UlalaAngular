import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Vote } from "../models/vote";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class VoteDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  getVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(EndPoint+'Vote', this.httpOptions)
  }
  getVote(id:number): Observable<Vote> {
    return this.http.get<Vote>(EndPoint+'Vote/'+id, this.httpOptions)
  }
  getVotesByUser(id:number): Observable<Vote[]> {
    return this.http.get<Vote[]>(EndPoint+'Vote/?UtilisateurId='+id, this.httpOptions)
  }
  postVote(monObjet: Vote): Observable<Vote> {
    return this.http.post<Vote>(EndPoint+'Vote', monObjet, this.httpOptions)
  }
  putVote(monObjet: Vote, id: number): Observable<Vote> {
    return this.http.put<Vote>(EndPoint+'Vote/'+id, monObjet, this.httpOptions)
  }
  deleteVote(id: number): Observable<Vote> {
    return this.http.delete<Vote>(EndPoint+'Vote/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
