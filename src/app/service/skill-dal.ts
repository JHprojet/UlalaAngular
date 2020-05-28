import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Skill } from "../models/skill";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class SkillDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(EndPoint+'Skill', this.Header())
  }
  getSkill(id:number): Observable<Skill> {
    return this.http.get<Skill>(EndPoint+'Skill/'+id, this.Header())
  }
  postSkill(monObjet: Skill): Observable<Skill> {
    return this.http.post<Skill>(EndPoint+'Skill', monObjet, this.Header())
  }
  putSkill(monObjet: Skill, id: number): Observable<Skill> {
    return this.http.put<Skill>(EndPoint+'Skill/'+id, monObjet, this.Header())
  }
  deleteSkill(id: number): Observable<Skill> {
    return this.http.delete<Skill>(EndPoint+'Skill/'+id, this.Header())
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })};
    return httpOptions;
  }
}
