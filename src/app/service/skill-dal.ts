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

  /**
  * Call to API to get all Skill
  * @returns Observable<Skill[]>
  */
  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(EndPoint+'Skill', this.Header())
  }
  /**
  * Call to API to get a Skill depending on his id
  * @param id Id of the Skill
  * @returns Observable<Skill>
  */
  getSkill(id:number): Observable<Skill> {
    return this.http.get<Skill>(EndPoint+'Skill/'+id, this.Header())
  }
  /**
  * Call to API to modify an existing Skill
  * @param Skill Skill
  * @param id Id of the Skill to modify
  * @returns Observable<Skill>
  */
  postSkill(Skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(EndPoint+'Skill', Skill, this.Header())
  }
  /**
  * Call to API to modify an existing Skill
  * @param Skill Skill
  * @param id Id of the Skill to modify
  * @returns Observable<Skill>
  */
  putSkill(Skill: Skill, id: number): Observable<Skill> {
    return this.http.put<Skill>(EndPoint+'Skill/'+id, Skill, this.Header())
  }
  /**
  * Call to API to delete an existing Skill
  * @param id Id of the Skill to delete
  * @returns Observable<Skill>
  */
  deleteSkill(id: number): Observable<Skill> {
    return this.http.delete<Skill>(EndPoint+'Skill/'+id, this.Header())
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
