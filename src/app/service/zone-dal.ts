import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Zone } from "../models/zone";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class ZoneDAL {
    constructor(private http: HttpClient) { }
    getZones(): Observable<Zone[]> {
        return this.http.get<Zone[]>(EndPoint+'Zone').pipe(catchError(this.handleError))
    }
    getZone(id:number): Observable<Zone> {
        return this.http.get<Zone>(EndPoint+'Zone/'+id).pipe(retry(1), catchError(this.handleError))
    }
    postZone(monObjet: Zone): Observable<Zone> {
        return this.http.post<Zone>(EndPoint+'Zone', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putZone(monObjet: Zone, id: number): Observable<Zone> {
        return this.http.put<Zone>(EndPoint+'Zone/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteZone(id: number): Observable<Zone> {
        return this.http.delete<Zone>(EndPoint+'Zone/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
