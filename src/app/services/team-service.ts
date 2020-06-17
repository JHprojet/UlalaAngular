import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Team } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';

@Injectable({ providedIn: 'root' })
export class TeamService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all Team
  * @returns Observable<Team[]>
  */
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(environement.API+'Team', this.Header())
  }
  /**
  * Call to API to get a Team depending on his id
  * @param id Id of the Team
  * @returns Observable<Team>
  */
  getTeamById(id:number): Observable<Team> {
    return this.http.get<Team>(environement.API+'Team/'+id, this.Header())
  }
  /**
  * Call to API to get all Team depending on user id
  * @param id Id of the user
  * @returns Observable<Team[]>
  */
  getTeamsByUserId(id:number): Observable<Team[]> {
    return this.http.get<Team[]>(environement.API+'Team/UserId='+id, this.Header())
  }
  /**
  * Call to API to modify an existing Team
  * @param Team Team
  * @param id Id of the Team to modify
  * @returns Observable<Team>
  */
  postTeam(Team: Team): Observable<Team> {
    return this.http.post<Team>(environement.API+'Team/Post',JSON.stringify(Team), this.Header())
  }
  /**
  * Call to API to modify an existing Team
  * @param Team Team
  * @param id Id of the Team to modify
  * @returns Observable<Team>
  */
  putTeamById(Team: Team, id: number): Observable<Team> {
    return this.http.put<Team>(environement.API+'Team/'+id, Team, this.Header())
  }
  /**
  * Call to API to delete an existing Team
  * @param id Id of the Team to delete
  * @returns Observable<Team>
  */
  deleteTeamById(id: number): Observable<Team> {
    return this.http.delete<Team>(environement.API+'Team/'+id, this.Header())
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
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonymous")??""
    })};
    return httpOptions;
  }
}
