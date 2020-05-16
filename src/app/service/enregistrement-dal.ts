import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Enregistrement } from "../models/enregistrement";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class EnregistrementDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  
  getStrategies(): Observable<Enregistrement[]> {
    return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement', this.httpOptions)
  }
  getStrategyById(id:number): Observable<Enregistrement> {
    return this.http.get<Enregistrement>(EndPoint+'Enregistrement/'+id, this.httpOptions)
  }
  getStrategiesByInfos(U:string, BZ:string, IdC1:string, IdC2:string, IdC3:string, IdC4:string): Observable<Enregistrement[]> {
    return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement/?U='+U+'&BZ='+BZ+'&C1='+IdC1+'&C2='+IdC2+'&C3='+IdC3+'&C4='+IdC4, this.httpOptions)
  }
  postStrategy(monObjet: Enregistrement): Observable<Enregistrement> {
    return this.http.post<Enregistrement>(EndPoint+'Enregistrement', monObjet, this.httpOptions)
  }
  putStrategyById(monObjet: Enregistrement, id: number): Observable<Enregistrement> {
    return this.http.put<Enregistrement>(EndPoint+'Enregistrement/'+id, monObjet, this.httpOptions)
  }
  deleteStrategyById(id: number): Observable<Enregistrement> {
    return this.http.delete<Enregistrement>(EndPoint+'Enregistrement/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
