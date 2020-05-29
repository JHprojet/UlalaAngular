import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Boss } from "../models/boss";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })

export class BossDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
 
  /**
  * Call to API to get all bosses
  * @returns Observable<Boss[]>
  */
  getBosses(): Observable<Boss[]> {
    return this.http.get<Boss[]>(EndPoint+'Boss', this.Header())
  }
  /**
  * Call to API to get a boss depending on his id
  * @param id Id of the boss
  * @returns Observable<Boss>
  */
  getBoss(id:number): Observable<Boss> {
    return this.http.get<Boss>(EndPoint+'Boss/'+id, this.Header())
  }
  /**
  * Call to API to post a new boss
  * @param Boss Boss
  * @returns Observable<Boss>
  */
  postBoss(Boss: Boss): Observable<Boss> {
    return this.http.post<Boss>(EndPoint+'Boss', Boss, this.Header())
  }
  /**
  * Call to API to modify an existing boss
  * @param Boss Boss
  * @param id Id of the Boss to modify
  * @returns Observable<Boss>
  */
  putBoss(Boss: Boss, id: number): Observable<Boss> {
    return this.http.put<Boss>(EndPoint+'Boss/'+id, Boss, this.Header())
  }
  /**
  * Call to API to delete an existing boss
  * @param id Id of the Boss to delete
  * @returns Observable<Boss>
  */
  deleteBoss(id: number): Observable<Boss> {
    return this.http.delete<Boss>(EndPoint+'Boss/'+id, this.Header())
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
