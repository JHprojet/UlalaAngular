import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Team } from "../models/team";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class TeamDal {
    constructor(private http: HttpClient) { }
    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(EndPoint+'Team').pipe(retry(1), catchError(this.handleError))
    }
    getTeamByClasses(idclasse1:number,idclasse2:number,idclasse3:number,idclasse4:number,): Observable<Team> {
        return this.http.get<Team>(EndPoint+'Team/'+'?C1='+idclasse1+'&C2='+idclasse2+'&C3='+idclasse3+'&C4='+idclasse4).pipe(retry(1), catchError(this.handleError))
    }
    getTeam(id:number): Observable<Team> {
        return this.http.get<Team>(EndPoint+'Team/'+id).pipe(retry(1), catchError(this.handleError))
    }
    postTeam(monObjet: Team): Observable<Team> {
        return this.http.post<Team>(EndPoint+'Team', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putTeam(monObjet: Team, id: number): Observable<Team> {
        return this.http.put<Team>(EndPoint+'Team/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteTeam(id: number): Observable<Team> {
        return this.http.delete<Team>(EndPoint+'Team/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
