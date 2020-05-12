import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Boss } from "../models/boss";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })

export class BossDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  getBosses(): Observable<Boss[]> {
    return this.http.get<Boss[]>(EndPoint+'Boss', this.httpOptions)
  }
  getBoss(id:number): Observable<Boss> {
    return this.http.get<Boss>(EndPoint+'Boss/'+id, this.httpOptions)
  }
  postBoss(monObjet: Boss): Observable<Boss> {
    return this.http.post<Boss>(EndPoint+'Boss', monObjet, this.httpOptions)
  }
  putBoss(monObjet: Boss, id: number): Observable<Boss> {
    return this.http.put<Boss>(EndPoint+'Boss/'+id, monObjet, this.httpOptions)
  }
  deleteBoss(id: number): Observable<Boss> {
    return this.http.delete<Boss>(EndPoint+'Boss/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
