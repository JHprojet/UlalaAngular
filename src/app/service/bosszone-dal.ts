import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BossZone } from "../models/boss-zone";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class BosszoneDAL {
    constructor(private http: HttpClient) { }
    getBossZones(): Observable<BossZone[]> {
        return this.http.get<BossZone[]>(EndPoint+'BossZone').pipe(retry(1), catchError(this.handleError))
    }
    getBossZone(id:number): Observable<BossZone> {
        return this.http.get<BossZone>(EndPoint+'BossZone/'+id).pipe(retry(1), catchError(this.handleError))
    }
    postBossZone(monObjet: BossZone): Observable<BossZone> {
        return this.http.post<BossZone>(EndPoint+'BossZone', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putBossZone(monObjet: BossZone, id: number): Observable<BossZone> {
        return this.http.put<BossZone>(EndPoint+'BossZone/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteBossZone(id: number): Observable<BossZone> {
        return this.http.delete<BossZone>(EndPoint+'BossZone/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
