import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Classe } from "../models/Classe";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class ClasseDAL {
  
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(EndPoint+'Classe', this.httpOptions)
  }
  getClasse(id:number): Observable<Classe> {
    return this.http.get<Classe>(EndPoint+'Classe/'+id, this.httpOptions)
  }
  postClasse(monObjet: Classe): Observable<Classe> {
    return this.http.post<Classe>(EndPoint+'Classe', monObjet, this.httpOptions)
  }
  putClasse(monObjet: Classe, id: number): Observable<Classe> {
    return this.http.put<Classe>(EndPoint+'Classe/'+id, monObjet, this.httpOptions)
  }
  deleteClasse(id: number): Observable<Classe> {
    return this.http.delete<Classe>(EndPoint+'Classe/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
