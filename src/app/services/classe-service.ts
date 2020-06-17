import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';
  
@Injectable({ providedIn: 'root' })
export class ClasseService {
  
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all Classe
  * @returns Observable<Classe[]>
  */
  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(environement.API+'Classe', this.Header())
  }
  /**
  * Call to API to get a Classe depending on his id
  * @param id Id of the Classe
  * @returns Observable<Classe>
  */
  getClasse(id:number): Observable<Classe> {
    return this.http.get<Classe>(environement.API+'Classe/'+id, this.Header())
  }
  /**
  * Call to API to post a new Classe
  * @param Classe Classe
  * @returns Observable<Classe>
  */
  postClasse(Classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(environement.API+'Classe', Classe, this.Header())
  }
  /**
  * Call to API to modify an existing Classe
  * @param Classe Classe
  * @param id Id of the Classe to modify
  * @returns Observable<Classe>
  */
  putClasse(Classe: Classe, id: number): Observable<Classe> {
    return this.http.put<Classe>(environement.API+'Classe/'+id, Classe, this.Header())
  }
  /**
  * Call to API to delete an existing Classe
  * @param id Id of the Classe to delete
  * @returns Observable<Classe>
  */
  deleteClasse(id: number): Observable<Classe> {
    return this.http.delete<Classe>(environement.API+'Classe/'+id, this.Header())
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
