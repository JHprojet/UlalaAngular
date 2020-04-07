import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Classe } from "../models/Classe";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class ClasseDAL {
    constructor(private http: HttpClient) { }
    getClasses(): Observable<Classe[]> {
        return this.http.get<Classe[]>(EndPoint+'Classe').pipe(retry(1), catchError(this.handleError))
    }
    getClasse(id:number): Observable<Classe> {
        return this.http.get<Classe>(EndPoint+'Classe/'+id).pipe(retry(1), catchError(this.handleError))
    }
    postClasse(monObjet: Classe): Observable<Classe> {
        return this.http.post<Classe>(EndPoint+'Classe', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putClasse(monObjet: Classe, id: number): Observable<Classe> {
        return this.http.put<Classe>(EndPoint+'Classe/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteClasse(id: number): Observable<Classe> {
        return this.http.delete<Classe>(EndPoint+'Classe/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      window.alert(errorMessage);
      return throwError(errorMessage);
    }
}
