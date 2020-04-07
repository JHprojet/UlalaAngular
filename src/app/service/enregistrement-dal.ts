import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Enregistrement } from "../models/enregistrement";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class EnregistrementDAL {
    constructor(private http: HttpClient) { }
    getEnregistrements(): Observable<Enregistrement[]> {
        return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement').pipe(retry(1), catchError(this.handleError))
    }
    getEnregistrement(id:number): Observable<Enregistrement> {
        return this.http.get<Enregistrement>(EndPoint+'Enregistrement/'+id).pipe(retry(1), catchError(this.handleError))
    }
    getEnregistrementsByInfos(U:string, BZ:string, IdC1:string, IdC2:string, IdC3:string, IdC4:string): Observable<Enregistrement[]> {
      return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement/?U='+U+'&BZ='+BZ+'&C1='+IdC1+'&C2='+IdC2+'&C3='+IdC3+'&C4='+IdC4)
    }
    postEnregistrement(monObjet: Enregistrement): Observable<Enregistrement> {
        return this.http.post<Enregistrement>(EndPoint+'Enregistrement', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putEnregistrement(monObjet: Enregistrement, id: number): Observable<Enregistrement> {
        return this.http.put<Enregistrement>(EndPoint+'Enregistrement/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteEnregistrement(id: number): Observable<Enregistrement> {
        return this.http.delete<Enregistrement>(EndPoint+'Enregistrement/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
