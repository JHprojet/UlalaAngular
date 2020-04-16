import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Skill } from "../models/skill";

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class SkillDAL {
    constructor(private http: HttpClient) { }
    getSkills(Token:string): Observable<Skill[]> {
        return this.http.get<Skill[]>(EndPoint+'Skill', this.GetHeader(Token))
    }
    getSkill(id:number, Token:string): Observable<Skill> {
        return this.http.get<Skill>(EndPoint+'Skill/'+id, this.GetHeader(Token))
    }
    postSkill(monObjet: Skill, Token:string): Observable<Skill> {
        return this.http.post<Skill>(EndPoint+'Skill', monObjet, this.GetHeader(Token))
    }
    putSkill(monObjet: Skill, id: number, Token:string): Observable<Skill> {
        return this.http.put<Skill>(EndPoint+'Skill/'+id, monObjet, this.GetHeader(Token))
    }
    deleteSkill(id: number, Token:string): Observable<Skill> {
        return this.http.delete<Skill>(EndPoint+'Skill/'+id, this.GetHeader(Token))
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
