import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zone } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement'
  
@Injectable({ providedIn: 'root' })
export class ZoneService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all Zone
  * @return Observable<Zone[]>
  */
  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(environement.API+'Zone', this.Header())
  }
  /**
  * Call to API to get a Zone depending on his id
  * @param id Zone's id
  * @return Observable<Zone>
  */
  getZoneById(id:number): Observable<Zone> {
    return this.http.get<Zone>(environement.API+'Zone/'+id, this.Header())
  }
  /**
  * Call to API to post a new Zone
  * @param Zone Zone
  * @return Observable<Zone>
  */
  postZone(Zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(environement.API+'Zone', Zone, this.Header())
  }
  /**
  * Call to API to edit a Zone
  * @param Zone Zone
  * @param id Zone's id
  * @return Observable<Zone>
  */
  putZoneById(Zone: Zone, id: number): Observable<Zone> {
    return this.http.put<Zone>(environement.API+'Zone/'+id, Zone, this.Header())
  }
  /**
  * Call to API to delete a Zone
  * @param id Zone's id
  * @return Observable<Zone>
  */
  deleteZoneById(id: number): Observable<Zone> {
    return this.http.delete<Zone>(environement.API+'Zone/'+id, this.Header())
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
