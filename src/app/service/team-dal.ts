import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Team } from "../models/team";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class TeamDal {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  /**
  * Call to API to get all Team
  * @returns Observable<Team[]>
  */
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(EndPoint+'Team', this.Header())
  }
  /**
  * Call to API to get a Team depending on all 4 classes
  * @param idclasse1 Id of the classe 1
  * @param idclasse1 Id of the classe 2
  * @param idclasse1 Id of the classe 3
  * @param idclasse1 Id of the classe 4
  * @returns Observable<Team>
  */
  getTeamByClasses(idclasse1:number,idclasse2:number,idclasse3:number,idclasse4:number): Observable<Team> {
    return this.http.get<Team>(EndPoint+'Team/'+'?C1='+idclasse1+'&C2='+idclasse2+'&C3='+idclasse3+'&C4='+idclasse4, this.Header())
  }
  /**
  * Call to API to get a Team depending on his id
  * @param id Id of the Team
  * @returns Observable<Team>
  */
  getTeamById(id:number): Observable<Team> {
    return this.http.get<Team>(EndPoint+'Team/'+id, this.Header())
  }
  /**
  * Call to API to modify an existing Team
  * @param Team Team
  * @param id Id of the Team to modify
  * @returns Observable<Team>
  */
  postTeam(Team: Team): Observable<Team> {
    return this.http.post<Team>(EndPoint+'Team', Team, this.Header())
  }
  /**
  * Call to API to modify an existing Team
  * @param Team Team
  * @param id Id of the Team to modify
  * @returns Observable<Team>
  */
  putTeamById(monObjet: Team, id:number): Observable<Team> {
    return this.http.put<Team>(EndPoint+'Team/'+id, monObjet, this.Header())
  }
  /**
  * Call to API to delete an existing Team
  * @param id Id of the Team to delete
  * @returns Observable<Team>
  */
  deleteTeamById(id: number): Observable<Team> {
    return this.http.delete<Team>(EndPoint+'Team/'+id, this.Header())
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
