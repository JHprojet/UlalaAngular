import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Toy } from '../models';
import { AccessService } from './access-service';
import { environement } from './environement';

@Injectable({ providedIn: 'root' })
export class ToyService {
  constructor(private http: HttpClient,private accessService:AccessService) { }
 
  /**
  * Call to API to get all Toy
  * @returns Observable<Toy[]>
  */
  getToys(): Observable<Toy[]> {
    return this.http.get<Toy[]>(environement.API+'Toy', this.Header())
  }
  /**
  * Call to API to get a Toy depending on his id
  * @param id Id of the Toy
  * @returns Observable<Toy>
  */
  getToyById(id:number): Observable<Toy> {
    return this.http.get<Toy>(environement.API+'Toy/'+id, this.Header())
  }
  /**
  * Call to API to modify an existing Toy
  * @param Toy Toy
  * @param id Id of the Toy to modify
  * @returns Observable<Toy>
  */
  postToy(Toy: Toy): Observable<Toy> {
    return this.http.post<Toy>(environement.API+'Toy', Toy, this.Header())
  }
  /**
  * Call to API to modify an existing Toy
  * @param Toy Toy
  * @param id Id of the Toy to modify
  * @returns Observable<Toy>
  */
  putToyById(Toy: Toy, id: number): Observable<Toy> {
    return this.http.put<Toy>(environement.API+'Toy/'+id, Toy, this.Header())
  }
  /**
  * Call to API to delete an existing Toy
  * @param id Id of the Toy to delete
  * @returns Observable<Toy>
  */
  deleteToyById(id: number): Observable<Toy> {
    return this.http.delete<Toy>(environement.API+'Toy/'+id, this.Header())
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
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonymous")??""
    })};
    return httpOptions;
  }
}
