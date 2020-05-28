import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Jouet } from "../models/jouet";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class JouetDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
 
  getToys(): Observable<Jouet[]> {
    return this.http.get<Jouet[]>(EndPoint+'Jouet', this.Header()).pipe(catchError(this.handleError))
  }
  getToyById(id:number): Observable<Jouet> {
    return this.http.get<Jouet>(EndPoint+'Jouet/'+id, this.Header()).pipe(catchError(this.handleError))
  }
  postToy(monObjet: Jouet): Observable<Jouet> {
    return this.http.post<Jouet>(EndPoint+'Jouet', monObjet, this.Header()).pipe(catchError(this.handleError))
  }
  putToyById(monObjet: Jouet, id: number): Observable<Jouet> {
    return this.http.put<Jouet>(EndPoint+'Jouet/'+id, monObjet, this.Header()).pipe(catchError(this.handleError))
  }
  deleteToyById(id: number): Observable<Jouet> {
    return this.http.delete<Jouet>(EndPoint+'Jouet/'+id, this.Header()).pipe(catchError(this.handleError))
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
