import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Enregistrement } from "../models/enregistrement";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class EnregistrementDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  /**
  * Call to API to get all Strategy
  * @returns Observable<Enregistrement[]>
  */
  getStrategies(): Observable<Enregistrement[]> {
    return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement', this.Header())
  }
  /**
  * Call to API to get a Strategy depending on his id
  * @param id Id of the Strategy
  * @returns Observable<Enregistrement>
  */
  getStrategyById(id:number): Observable<Enregistrement> {
    return this.http.get<Enregistrement>(EndPoint+'Enregistrement/'+id, this.Header())
  }
  /**
  * Call to API to get all Strategy depend on User, BossZone and Classes
  * @param U Id of the User
  * @param BZ Id of the BossZone
  * @param IdC1 Id of the Classe 1
  * @param IdC2 Id of the Classe 2
  * @param IdC3 Id of the Classe 3
  * @param IdC4 Id of the Classe 4
  * @returns Observable<Enregistrement[]>
  */
  getStrategiesByInfos(U:string, BZ:string, IdC1:string, IdC2:string, IdC3:string, IdC4:string): Observable<Enregistrement[]> {
    return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement/?U='+U+'&BZ='+BZ+'&C1='+IdC1+'&C2='+IdC2+'&C3='+IdC3+'&C4='+IdC4, this.Header())
  }
  /**
  * Call to API to post a new Strategy
  * @param Strategy Strategy
  * @returns Observable<Enregistrement>
  */
  postStrategy(Strategy: Enregistrement): Observable<Enregistrement> {
    return this.http.post<Enregistrement>(EndPoint+'Enregistrement', Strategy, this.Header())
  }
  /**
  * Call to API to modify an existing Strategy
  * @param Strategy Strategy
  * @param id Id of the Strategy to modify
  * @returns Observable<Enregistrement>
  */
  putStrategyById(Strategy: Enregistrement, id: number): Observable<Enregistrement> {
    return this.http.put<Enregistrement>(EndPoint+'Enregistrement/'+id, Strategy, this.Header())
  }
  /**
  * Call to API to delete an existing Strategy
  * @param id Id of the Strategy to delete
  * @returns Observable<Enregistrement>
  */
  deleteStrategyById(id: number): Observable<Enregistrement> {
    return this.http.delete<Enregistrement>(EndPoint+'Enregistrement/'+id, this.Header())
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
