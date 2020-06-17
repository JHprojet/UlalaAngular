import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';
  
@Injectable({ providedIn: 'root' })
export class SkillService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all Skill
  * @returns Observable<Skill[]>
  */
  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(environement.API+'Skill', this.Header())
  }
  /**
  * Call to API to get a Skill depending on his id
  * @param id Id of the Skill
  * @returns Observable<Skill>
  */
  getSkillById(id:number): Observable<Skill> {
    return this.http.get<Skill>(environement.API+'Skill/'+id, this.Header())
  }
  /**
  * Call to API to modify an existing Skill
  * @param Skill Skill
  * @param id Id of the Skill to modify
  * @returns Observable<Skill>
  */
  postSkill(Skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(environement.API+'Skill', Skill, this.Header())
  }
  /**
  * Call to API to modify an existing Skill
  * @param Skill Skill
  * @param id Id of the Skill to modify
  * @returns Observable<Skill>
  */
  putSkillById(Skill: Skill, id: number): Observable<Skill> {
    return this.http.put<Skill>(environement.API+'Skill/'+id, Skill, this.Header())
  }
  /**
  * Call to API to delete an existing Skill
  * @param id Id of the Skill to delete
  * @returns Observable<Skill>
  */
  deleteSkill(id: number): Observable<Skill> {
    return this.http.delete<Skill>(environement.API+'Skill/'+id, this.Header())
  }
  /**
  * Create the httpOptions header with Authorization
  * @returns httpOptions
  */
  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonymous")??""
    })};
    return httpOptions;
  }
}
