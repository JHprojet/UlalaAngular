import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Strategy } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';

  
@Injectable({ providedIn: 'root' })
export class StrategyService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all Strategy
  * @returns Observable<Strategy[]>
  */
  getStrategies(): Observable<Strategy[]> {
    return this.http.get<Strategy[]>(environement.API+'Strategy', this.Header())
  }
  /**
  * Call to API to get a Strategy depending on his id
  * @param id Id of the Strategy
  * @returns Observable<Strategy>
  */
  getStrategyById(id:number): Observable<Strategy> {
    return this.http.get<Strategy>(environement.API+'Strategy/'+id, this.Header())
  }
  /**
  * Call to API to get all Strategy depend on User, BossZone and Classes
  * @param U Id of the User
  * @param BZ Id of the BossZone
  * @param IdC1 Id of the Classe 1
  * @param IdC2 Id of the Classe 2
  * @param IdC3 Id of the Classe 3
  * @param IdC4 Id of the Classe 4
  * @returns Observable<Strategy[]>
  */
  getStrategiesByInfos(U:string, BZ:string, IdC1:string, IdC2:string, IdC3:string, IdC4:string): Observable<Strategy[]> {
    return this.http.get<Strategy[]>(environement.API+'Strategy/?U='+U+'&BZ='+BZ+'&C1='+IdC1+'&C2='+IdC2+'&C3='+IdC3+'&C4='+IdC4, this.Header())
  }
  /**
  * Call to API to post a new Strategy
  * @param Strategy Strategy
  * @returns Observable<Strategy>
  */
  postStrategy(Strategy: Strategy): Observable<Strategy> {
    return this.http.post<Strategy>(environement.API+'Strategy', Strategy, this.Header())
  }
  /**
  * Call to API to modify an existing Strategy
  * @param Strategy Strategy
  * @param id Id of the Strategy to modify
  * @returns Observable<Strategy>
  */
  putStrategyById(Strategy: Strategy, id: number): Observable<Strategy> {
    return this.http.put<Strategy>(environement.API+'Strategy/'+id, Strategy, this.Header())
  }
  /**
  * Call to API to delete an existing Strategy
  * @param id Id of the Strategy to delete
  * @returns Observable<Strategy>
  */
  deleteStrategyById(id: number): Observable<Strategy> {
    return this.http.delete<Strategy>(environement.API+'Strategy/'+id, this.Header())
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
