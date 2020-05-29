import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MesTeams } from "../models/mes-teams";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class MesTeamsDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  /**
  * Call to API to get all MesTeams
  * @returns Observable<MesTeams[]>
  */
  getMyTeams(): Observable<MesTeams[]> {
    return this.http.get<MesTeams[]>(EndPoint+'MesTeams', this.Header())
  }
  /**
  * Call to API to get a MesTeams depending on his id
  * @param id Id of the MesTeams
  * @returns Observable<MesTeams>
  */
  getMyTeam(id:number): Observable<MesTeams> {
    return this.http.get<MesTeams>(EndPoint+'MesTeams/'+id, this.Header())
  }
  /**
  * Call to API to get all MesTeams depending on user id
  * @param id Id of the user
  * @returns Observable<MesTeams[]>
  */
  getMyTeamsByUserId(id:number): Observable<MesTeams[]> {
    return this.http.get<MesTeams[]>(EndPoint+'MesTeams/?UtilisateurId='+id, this.Header())
  }
  /**
  * Call to API to modify an existing MesTeams
  * @param MesTeams MesTeams
  * @param id Id of the MesTeams to modify
  * @returns Observable<MesTeams>
  */
  postMyTeam(MesTeams: MesTeams): Observable<MesTeams> {
    return this.http.post<MesTeams>(EndPoint+'MesTeams', MesTeams, this.Header())
  }
  /**
  * Call to API to modify an existing MesTeams
  * @param MesTeams MesTeams
  * @param id Id of the MesTeams to modify
  * @returns Observable<MesTeams>
  */
  putMyTeamById(MesTeams: MesTeams, id: number): Observable<MesTeams> {
    return this.http.put<MesTeams>(EndPoint+'MesTeams/'+id, MesTeams, this.Header())
  }
  /**
  * Call to API to delete an existing MesTeams
  * @param id Id of the MesTeams to delete
  * @returns Observable<MesTeams>
  */
  deleteMyTeamById(id: number): Observable<MesTeams> {
    return this.http.delete<MesTeams>(EndPoint+'MesTeams/'+id, this.Header())
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
