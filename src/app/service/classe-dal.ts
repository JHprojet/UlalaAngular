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

  /**
  * Call to API to get all Classe
  * @returns Observable<Classe[]>
  */
  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(EndPoint+'Classe', this.Header())
  }
  /**
  * Call to API to get a Classe depending on his id
  * @param id Id of the Classe
  * @returns Observable<Classe>
  */
  getClasse(id:number): Observable<Classe> {
    return this.http.get<Classe>(EndPoint+'Classe/'+id, this.Header())
  }
  /**
  * Call to API to post a new Classe
  * @param Classe Classe
  * @returns Observable<Classe>
  */
  postClasse(Classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(EndPoint+'Classe', Classe, this.Header())
  }
  /**
  * Call to API to modify an existing Classe
  * @param Classe Classe
  * @param id Id of the Classe to modify
  * @returns Observable<Classe>
  */
  putClasse(Classe: Classe, id: number): Observable<Classe> {
    return this.http.put<Classe>(EndPoint+'Classe/'+id, Classe, this.Header())
  }
  /**
  * Call to API to delete an existing Classe
  * @param id Id of the Classe to delete
  * @returns Observable<Classe>
  */
  deleteClasse(id: number): Observable<Classe> {
    return this.http.delete<Classe>(EndPoint+'Classe/'+id, this.Header())
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
