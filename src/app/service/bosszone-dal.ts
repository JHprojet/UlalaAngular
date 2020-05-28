import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BossZone } from "../models/boss-zone";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class BosszoneDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  getBossZones(): Observable<BossZone[]> {
    return this.http.get<BossZone[]>(EndPoint+'BossZone', this.Header())
  }
  getBossZone(id:number): Observable<BossZone> {
    return this.http.get<BossZone>(EndPoint+'BossZone/'+id, this.Header())
  }
  postBossZone(monObjet: BossZone): Observable<BossZone> {
    return this.http.post<BossZone>(EndPoint+'BossZone', monObjet, this.Header())
  }
  putBossZone(monObjet: BossZone, id:number): Observable<BossZone> {
    return this.http.put<BossZone>(EndPoint+'BossZone/'+id, monObjet, this.Header())
  }
  deleteBossZone(id: number): Observable<BossZone> {
    return this.http.delete<BossZone>(EndPoint+'BossZone/'+id, this.Header())
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })};
    return httpOptions;
  }
}
