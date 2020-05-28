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

  getVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(EndPoint+'Vote', this.Header())
  }
  getVoteById(id:number): Observable<Vote> {
    return this.http.get<Vote>(EndPoint+'Vote/'+id, this.Header())
  }
  getVotesByUser(id:number): Observable<Vote[]> {
    return this.http.get<Vote[]>(EndPoint+'Vote/?UtilisateurId='+id, this.Header())
  }
  postVote(monObjet: Vote): Observable<Vote> {
    return this.http.post<Vote>(EndPoint+'Vote', monObjet, this.Header())
  }
  putVoteById(monObjet: Vote, id: number): Observable<Vote> {
    return this.http.put<Vote>(EndPoint+'Vote/'+id, monObjet, this.Header())
  }
  deleteVoteById(id: number): Observable<Vote> {
    return this.http.delete<Vote>(EndPoint+'Vote/'+id, this.Header())
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
