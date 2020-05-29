import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Zone } from "../models/zone";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class ZoneDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  /**
  * Call to API to get all Zone
  * @return Observable<Zone[]>
  */
  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(EndPoint+'Zone', this.Header())
  }
  /**
  * Call to API to get a Zone depending on his id
  * @param id Zone's id
  * @return Observable<Zone>
  */
  getZoneById(id:number): Observable<Zone> {
    return this.http.get<Zone>(EndPoint+'Zone/'+id, this.Header())
  }
  /**
  * Call to API to post a new Zone
  * @param Zone Zone
  * @return Observable<Zone>
  */
  postZone(Zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(EndPoint+'Zone', Zone, this.Header())
  }
  /**
  * Call to API to edit a Zone
  * @param Zone Zone
  * @param id Zone's id
  * @return Observable<Zone>
  */
  putZoneById(Zone: Zone, id: number): Observable<Zone> {
    return this.http.put<Zone>(EndPoint+'Zone/'+id, Zone, this.Header())
  }
  /**
  * Call to API to delete a Zone
  * @param id Zone's id
  * @return Observable<Zone>
  */
  deleteZoneById(id: number): Observable<Zone> {
    return this.http.delete<Zone>(EndPoint+'Zone/'+id, this.Header())
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
