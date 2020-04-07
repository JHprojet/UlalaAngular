import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Boss } from "../models/boss";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class BossDAL {
    constructor(private http: HttpClient) { }
    getBosses(): Observable<Boss[]> {
        return this.http.get<Boss[]>(EndPoint+'Boss').pipe(retry(1), catchError(this.handleError))
    }
    getBoss(id:number): Observable<Boss> {
        return this.http.get<Boss>(EndPoint+'Boss/'+id).pipe(retry(1), catchError(this.handleError))
    }
    postBoss(monObjet: Boss): Observable<Boss> {
        return this.http.post<Boss>(EndPoint+'Boss', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putBoss(monObjet: Boss, id: number): Observable<Boss> {
        return this.http.put<Boss>(EndPoint+'Boss/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteBoss(id: number): Observable<Boss> {
        return this.http.delete<Boss>(EndPoint+'Boss/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
