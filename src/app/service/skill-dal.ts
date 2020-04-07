import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Skill } from "../models/skill";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class SkillDAL {
    constructor(private http: HttpClient) { }
    getSkills(): Observable<Skill[]> {
        return this.http.get<Skill[]>(EndPoint+'Skill').pipe(retry(1), catchError(this.handleError))
    }
    getSkill(id:number): Observable<Skill> {
        return this.http.get<Skill>(EndPoint+'Skill/'+id).pipe(retry(1), catchError(this.handleError))
    }
    postSkill(monObjet: Skill): Observable<Skill> {
        return this.http.post<Skill>(EndPoint+'Skill', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putSkill(monObjet: Skill, id: number): Observable<Skill> {
        return this.http.put<Skill>(EndPoint+'Skill/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteSkill(id: number): Observable<Skill> {
        return this.http.delete<Skill>(EndPoint+'Skill/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
