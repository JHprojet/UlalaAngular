import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BossZone } from "../models/boss-zone";

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class BosszoneDAL {
    constructor(private http: HttpClient) { }
    getBossZones(Token:string): Observable<BossZone[]> {
        return this.http.get<BossZone[]>(EndPoint+'BossZone', this.GetHeader(Token))
    }
    getBossZone(id:number, Token:string): Observable<BossZone> {
        return this.http.get<BossZone>(EndPoint+'BossZone/'+id, this.GetHeader(Token))
    }
    postBossZone(monObjet: BossZone, Token:string): Observable<BossZone> {
        return this.http.post<BossZone>(EndPoint+'BossZone', monObjet, this.GetHeader(Token))
    }
    putBossZone(monObjet: BossZone, id:number, Token:string): Observable<BossZone> {
        return this.http.put<BossZone>(EndPoint+'BossZone/'+id, monObjet, this.GetHeader(Token))
    }
    deleteBossZone(id: number, Token:string): Observable<BossZone> {
        return this.http.delete<BossZone>(EndPoint+'BossZone/'+id, this.GetHeader(Token))
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
