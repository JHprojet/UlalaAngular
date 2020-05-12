import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MesTeams } from "../models/mes-teams";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class MesTeamsDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  getMesTeams(): Observable<MesTeams[]> {
    return this.http.get<MesTeams[]>(EndPoint+'MesTeams', this.httpOptions)
  }
  getMaTeam(id:number): Observable<MesTeams> {
    return this.http.get<MesTeams>(EndPoint+'MesTeams/'+id, this.httpOptions)
  }
  getMeTeamsByUserId(id:number): Observable<MesTeams[]> {
    return this.http.get<MesTeams[]>(EndPoint+'MesTeams/?UtilisateurId='+id, this.httpOptions)
  }
  postMaTeam(monObjet: MesTeams): Observable<MesTeams> {
    return this.http.post<MesTeams>(EndPoint+'MesTeams', monObjet, this.httpOptions)
  }
  putMaTeam(monObjet: MesTeams, id: number): Observable<MesTeams> {
    return this.http.put<MesTeams>(EndPoint+'MesTeams/'+id, monObjet, this.httpOptions)
  }
  deleteMaTeam(id: number): Observable<MesTeams> {
    return this.http.delete<MesTeams>(EndPoint+'MesTeams/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
