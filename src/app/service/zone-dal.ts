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

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(EndPoint+'Zone', this.Header())
  }
  getZoneById(id:number): Observable<Zone> {
    return this.http.get<Zone>(EndPoint+'Zone/'+id, this.Header())
  }
  postZone(monObjet: Zone): Observable<Zone> {
    return this.http.post<Zone>(EndPoint+'Zone', monObjet, this.Header())
  }
  putZoneById(monObjet: Zone, id: number): Observable<Zone> {
    return this.http.put<Zone>(EndPoint+'Zone/'+id, monObjet, this.Header())
  }
  deleteZoneById(id: number): Observable<Zone> {
    return this.http.delete<Zone>(EndPoint+'Zone/'+id, this.Header())
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
