import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vote } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement'
  
@Injectable({ providedIn: 'root' })
export class VoteService {
  constructor(private http: HttpClient,private accessService:AccessService) { }
  
  /**
  * Call to API to get all Votes
  * @return Observable<Vote[]>
  */
  getVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(environement.API+'Vote', this.Header())
  }
  /**
  * Call to API to get a Vote depending on his id
  * @param id Vote's id
  * @return Observable<Vote>
  */
  getVoteById(id:number): Observable<Vote> {
    return this.http.get<Vote>(environement.API+'Vote/'+id, this.Header())
  }
  /**
  * Call to API to get all Votes of a user
  * @param id user id
  * @return Observable<Vote[]>
  */
  getVotesByUser(id:number): Observable<Vote[]> {
    return this.http.get<Vote[]>(environement.API+'Vote/?UtilisateurId='+id, this.Header())
  }
  /**
  * Call to API to post a new Vote
  * @param vote Vote
  * @return Observable<Vote>
  */
  postVote(vote: Vote): Observable<Vote> {
    return this.http.post<Vote>(environement.API+'Vote', vote, this.Header())
  }
  /**
  * Call to API to edit a Vote
  * @param vote Vote
  * @param id Vote's id
  * @return Observable<Vote>
  */
  putVoteById(vote: Vote, id: number): Observable<Vote> {
    return this.http.put<Vote>(environement.API+'Vote/'+id, vote, this.Header())
  }
  /**
  * Call to API to delete a Vote
  * @param id Vote's id
  * @return Observable<Vote>
  */
  deleteVoteById(id: number): Observable<Vote> {
    return this.http.delete<Vote>(environement.API+'Vote/'+id, this.Header())
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
