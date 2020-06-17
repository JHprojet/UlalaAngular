import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boss } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';
  
@Injectable({ providedIn: 'root' })

export class BossService {
  constructor(private http: HttpClient,private accessService:AccessService) { }
 
  /**
  * Call to API to get all bosses
  * @returns Observable<Boss[]>
  */
  getBosses(): Observable<Boss[]> {
    return this.http.get<Boss[]>(environement.API+'Boss', this.Header())
  }
  /**
  * Call to API to get a boss depending on his id
  * @param id Id of the boss
  * @returns Observable<Boss>
  */
  getBoss(id:number): Observable<Boss> {
    return this.http.get<Boss>(environement.API+'Boss/'+id, this.Header())
  }
  /**
  * Call to API to post a new boss
  * @param Boss Boss
  * @returns Observable<Boss>
  */
  postBoss(Boss: Boss): Observable<Boss> {
    return this.http.post<Boss>(environement.API+'Boss', Boss, this.Header())
  }
  /**
  * Call to API to modify an existing boss
  * @param Boss Boss
  * @param id Id of the Boss to modify
  * @returns Observable<Boss>
  */
  putBoss(Boss: Boss, id: number): Observable<Boss> {
    return this.http.put<Boss>(environement.API+'Boss/'+id, Boss, this.Header())
  }
  /**
  * Call to API to delete an existing boss
  * @param id Id of the Boss to delete
  * @returns Observable<Boss>
  */
  deleteBoss(id: number): Observable<Boss> {
    return this.http.delete<Boss>(environement.API+'Boss/'+id, this.Header())
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
