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

  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(EndPoint+'Classe', this.Header())
  }
  getClasse(id:number): Observable<Classe> {
    return this.http.get<Classe>(EndPoint+'Classe/'+id, this.Header())
  }
  postClasse(monObjet: Classe): Observable<Classe> {
    return this.http.post<Classe>(EndPoint+'Classe', monObjet, this.Header())
  }
  putClasse(monObjet: Classe, id: number): Observable<Classe> {
    return this.http.put<Classe>(EndPoint+'Classe/'+id, monObjet, this.Header())
  }
  deleteClasse(id: number): Observable<Classe> {
    return this.http.delete<Classe>(EndPoint+'Classe/'+id, this.Header())
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
