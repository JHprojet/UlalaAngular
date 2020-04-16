import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Team } from "../models/team";

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class TeamDal {
    constructor(private http: HttpClient) { }
    getTeams(Token:string): Observable<Team[]> {
        return this.http.get<Team[]>(EndPoint+'Team', this.GetHeader(Token))
    }
    getTeamByClasses(idclasse1:number,idclasse2:number,idclasse3:number,idclasse4:number,Token:string): Observable<Team> {
        return this.http.get<Team>(EndPoint+'Team/'+'?C1='+idclasse1+'&C2='+idclasse2+'&C3='+idclasse3+'&C4='+idclasse4, this.GetHeader(Token))
    }
    getTeam(id:number, Token): Observable<Team> {
        return this.http.get<Team>(EndPoint+'Team/'+id, this.GetHeader(Token))
    }
    postTeam(monObjet: Team, Token:string): Observable<Team> {
        return this.http.post<Team>(EndPoint+'Team', monObjet, this.GetHeader(Token))
    }
    putTeam(monObjet: Team, id:number, Token:string): Observable<Team> {
        return this.http.put<Team>(EndPoint+'Team/'+id, monObjet, this.GetHeader(Token))
    }
    deleteTeam(id: number, Token:string): Observable<Team> {
        return this.http.delete<Team>(EndPoint+'Team/'+id, this.GetHeader(Token))
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
