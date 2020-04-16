import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { MesTeams } from "../models/mes-teams";

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class MesTeamsDAL {
    constructor(private http: HttpClient) { }
    getMesTeams(Token:string): Observable<MesTeams[]> {
        return this.http.get<MesTeams[]>(EndPoint+'MesTeams', this.GetHeader(Token))
    }
    getMaTeam(id:number, Token:string): Observable<MesTeams> {
        return this.http.get<MesTeams>(EndPoint+'MesTeams/'+id, this.GetHeader(Token))
    }
    getMeTeamsByUserId(id:number, Token:string): Observable<MesTeams[]> {
      return this.http.get<MesTeams[]>(EndPoint+'MesTeams/?UtilisateurId='+id, this.GetHeader(Token))
    }
    postMaTeam(monObjet: MesTeams, Token:string): Observable<MesTeams> {
        return this.http.post<MesTeams>(EndPoint+'MesTeams', monObjet, this.GetHeader(Token))
    }
    putMaTeam(monObjet: MesTeams, id: number, Token:string): Observable<MesTeams> {
        return this.http.put<MesTeams>(EndPoint+'MesTeams/'+id, monObjet, this.GetHeader(Token))
    }
    deleteMaTeam(id: number, Token:string): Observable<MesTeams> {
        return this.http.delete<MesTeams>(EndPoint+'MesTeams/'+id, this.GetHeader(Token))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      return throwError(errorMessage);
    }
    GetHeader(Token?:string)
    {
      let tok = Token??""
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization' : tok
        })
      };
      return httpOptions;
    }
}
