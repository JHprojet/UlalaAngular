import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { MesTeams } from "../models/mes-teams";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class MesTeamsDAL {
    constructor(private http: HttpClient) { }
    getMesTeams(): Observable<MesTeams[]> {
        return this.http.get<MesTeams[]>(EndPoint+'MesTeams').pipe(catchError(this.handleError))
    }
    getMaTeam(id:number): Observable<MesTeams> {
        return this.http.get<MesTeams>(EndPoint+'MesTeams/'+id).pipe(catchError(this.handleError))
    }
    getMeTeamsByUserId(id:number): Observable<MesTeams[]> {
      return this.http.get<MesTeams[]>(EndPoint+'MesTeams/?UtilisateurId='+id).pipe(catchError(this.handleError))
    }
    postMaTeam(monObjet: MesTeams): Observable<MesTeams> {
        return this.http.post<MesTeams>(EndPoint+'MesTeams', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putMaTeam(monObjet: MesTeams, id: number): Observable<MesTeams> {
        return this.http.put<MesTeams>(EndPoint+'MesTeams/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteMaTeam(id: number): Observable<MesTeams> {
        return this.http.delete<MesTeams>(EndPoint+'MesTeams/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      return throwError(errorMessage);
    }
}
