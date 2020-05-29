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

  /**
  * Call to API to get all BossZone
  * @returns Observable<BossZone[]>
  */
  getBossZones(): Observable<BossZone[]> {
    return this.http.get<BossZone[]>(EndPoint+'BossZone', this.Header())
  }
  /**
  * Call to API to get a BossZone depending on his id
  * @param id Id of the BossZone
  * @returns Observable<BossZone>
  */
  getBossZone(id:number): Observable<BossZone> {
    return this.http.get<BossZone>(EndPoint+'BossZone/'+id, this.Header())
  }
  /**
  * Call to API to post a new BossZone
  * @param BossZone BossZone
  * @returns Observable<BossZone>
  */
  postBossZone(BossZone: BossZone): Observable<BossZone> {
    return this.http.post<BossZone>(EndPoint+'BossZone', BossZone, this.Header())
  }
  /**
  * Call to API to modify an existing BossZone
  * @param BossZone BossZone
  * @param id Id of the BossZone to modify
  * @returns Observable<BossZone>
  */
  putBossZone(BossZone: BossZone, id:number): Observable<BossZone> {
    return this.http.put<BossZone>(EndPoint+'BossZone/'+id, BossZone, this.Header())
  }
  /**
  * Call to API to delete an existing BossZone
  * @param id Id of the BossZone to delete
  * @returns Observable<BossZone>
  */
  deleteBossZone(id: number): Observable<BossZone> {
    return this.http.delete<BossZone>(EndPoint+'BossZone/'+id, this.Header())
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
