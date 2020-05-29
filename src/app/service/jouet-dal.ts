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
 
  /**
  * Call to API to get all Jouet
  * @returns Observable<Jouet[]>
  */
  getToys(): Observable<Jouet[]> {
    return this.http.get<Jouet[]>(EndPoint+'Jouet', this.Header()).pipe(catchError(this.handleError))
  }
  /**
  * Call to API to get a Jouet depending on his id
  * @param id Id of the Jouet
  * @returns Observable<Jouet>
  */
  getToyById(id:number): Observable<Jouet> {
    return this.http.get<Jouet>(EndPoint+'Jouet/'+id, this.Header()).pipe(catchError(this.handleError))
  }
  /**
  * Call to API to modify an existing Jouet
  * @param Jouet Jouet
  * @param id Id of the Jouet to modify
  * @returns Observable<Jouet>
  */
  postToy(Jouet: Jouet): Observable<Jouet> {
    return this.http.post<Jouet>(EndPoint+'Jouet', Jouet, this.Header()).pipe(catchError(this.handleError))
  }
  /**
  * Call to API to modify an existing Jouet
  * @param Jouet Jouet
  * @param id Id of the Jouet to modify
  * @returns Observable<Jouet>
  */
  putToyById(Jouet: Jouet, id: number): Observable<Jouet> {
    return this.http.put<Jouet>(EndPoint+'Jouet/'+id, Jouet, this.Header()).pipe(catchError(this.handleError))
  }
  /**
  * Call to API to delete an existing Jouet
  * @param id Id of the Jouet to delete
  * @returns Observable<Jouet>
  */
  deleteToyById(id: number): Observable<Jouet> {
    return this.http.delete<Jouet>(EndPoint+'Jouet/'+id, this.Header()).pipe(catchError(this.handleError))
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
