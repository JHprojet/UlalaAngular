import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Jouet } from "../models/jouet";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class JouetDAL {
    constructor(private http: HttpClient) { }
    getJouets(): Observable<Jouet[]> {
        return this.http.get<Jouet[]>(EndPoint+'Jouet').pipe(retry(1), catchError(this.handleError))
    }
    getJouet(id:number): Observable<Jouet> {
        return this.http.get<Jouet>(EndPoint+'Jouet/'+id).pipe(retry(1), catchError(this.handleError))
    }
    postJouet(monObjet: Jouet): Observable<Jouet> {
        return this.http.post<Jouet>(EndPoint+'Jouet', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putJouet(monObjet: Jouet, id: number): Observable<Jouet> {
        return this.http.put<Jouet>(EndPoint+'Jouet/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteJouet(id: number): Observable<Jouet> {
        return this.http.delete<Jouet>(EndPoint+'Jouet/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
