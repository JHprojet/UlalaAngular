import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BossesPerZone } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';


@Injectable({ providedIn: 'root' })
export class BossesPerZoneService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all BossesPerZone
  * @returns Observable<BossesPerZone[]>
  */
  getBossesPerZones(): Observable<BossesPerZone[]> {
    return this.http.get<BossesPerZone[]>(environement.API+'BossesPerZone', this.Header())
  }
  /**
  * Call to API to get a BossesPerZone depending on his id
  * @param id Id of the BossesPerZone
  * @returns Observable<BossesPerZone>
  */
  getBossesPerZone(id:number): Observable<BossesPerZone> {
    return this.http.get<BossesPerZone>(environement.API+'BossesPerZone/'+id, this.Header())
  }
  /**
  * Call to API to post a new BossesPerZone
  * @param BossesPerZone BossesPerZone
  * @returns Observable<BossesPerZone>
  */
  postBossesPerZone(BossesPerZone: BossesPerZone): Observable<BossesPerZone> {
    return this.http.post<BossesPerZone>(environement.API+'BossesPerZone', BossesPerZone, this.Header())
  }
  /**
  * Call to API to modify an existing BossesPerZone
  * @param BossesPerZone BossesPerZone
  * @param id Id of the BossesPerZone to modify
  * @returns Observable<BossesPerZone>
  */
  putBossesPerZone(BossesPerZone: BossesPerZone, id:number): Observable<BossesPerZone> {
    return this.http.put<BossesPerZone>(environement.API+'BossesPerZone/'+id, BossesPerZone, this.Header())
  }
  /**
  * Call to API to delete an existing BossesPerZone
  * @param id Id of the BossesPerZone to delete
  * @returns Observable<BossesPerZone>
  */
  deleteBossesPerZone(id: number): Observable<BossesPerZone> {
    return this.http.delete<BossesPerZone>(environement.API+'BossesPerZone/'+id, this.Header())
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
