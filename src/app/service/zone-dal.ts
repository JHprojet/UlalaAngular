import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Zone } from "../models/zone";

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class ZoneDAL {
    constructor(private http: HttpClient) { }
    getZones(Token:string): Observable<Zone[]> {
        return this.http.get<Zone[]>(EndPoint+'Zone', this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    getZone(id:number, Token:string): Observable<Zone> {
        return this.http.get<Zone>(EndPoint+'Zone/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    postZone(monObjet: Zone, Token:string): Observable<Zone> {
        return this.http.post<Zone>(EndPoint+'Zone', monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    putZone(monObjet: Zone, id: number, Token:string): Observable<Zone> {
        return this.http.put<Zone>(EndPoint+'Zone/'+id, monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    deleteZone(id: number, Token:string): Observable<Zone> {
        return this.http.delete<Zone>(EndPoint+'Zone/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
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
