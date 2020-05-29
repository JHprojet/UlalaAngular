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

  /**
  * Call to API to get all Votes
  * @return Observable<Vote[]>
  */
  getVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(EndPoint+'Vote', this.Header())
  }
  /**
  * Call to API to get a Vote depending on his id
  * @param id Vote's id
  * @return Observable<Vote>
  */
  getVoteById(id:number): Observable<Vote> {
    return this.http.get<Vote>(EndPoint+'Vote/'+id, this.Header())
  }
  /**
  * Call to API to get all Votes of a user
  * @param id user id
  * @return Observable<Vote[]>
  */
  getVotesByUser(id:number): Observable<Vote[]> {
    return this.http.get<Vote[]>(EndPoint+'Vote/?UtilisateurId='+id, this.Header())
  }
  /**
  * Call to API to post a new Vote
  * @param vote Vote
  * @return Observable<Vote>
  */
  postVote(vote: Vote): Observable<Vote> {
    return this.http.post<Vote>(EndPoint+'Vote', vote, this.Header())
  }
  /**
  * Call to API to edit a Vote
  * @param vote Vote
  * @param id Vote's id
  * @return Observable<Vote>
  */
  putVoteById(vote: Vote, id: number): Observable<Vote> {
    return this.http.put<Vote>(EndPoint+'Vote/'+id, vote, this.Header())
  }
  /**
  * Call to API to delete a Vote
  * @param id Vote's id
  * @return Observable<Vote>
  */
  deleteVoteById(id: number): Observable<Vote> {
    return this.http.delete<Vote>(EndPoint+'Vote/'+id, this.Header())
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
