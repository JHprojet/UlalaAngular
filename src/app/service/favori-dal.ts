import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Favori } from "../models/Favori";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class FavoriDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  /**
  * Call to API to get all Favori
  * @returns Observable<Favori[]>
  */
  getFavorites(): Observable<Favori[]> {
    return this.http.get<Favori[]>(EndPoint+'Favoris', this.Header())
  }
  /**
  * Call to API to get a Favori depending on his id
  * @param id Id of the Favori
  * @returns Observable<Favori>
  */
  getFavorite(id:number): Observable<Favori> {
    return this.http.get<Favori>(EndPoint+'Favoris/'+id, this.Header())
  }
  /**
  * Call to API to get all Favori depending on user id
  * @param id Id of the User
  * @returns Observable<Favori[]>
  */
  getFavoritesByUserId(id:number): Observable<Favori[]> {
    return this.http.get<Favori[]>(EndPoint+'Favoris/?UtilisateurId='+id, this.Header())
  }
  /**
  * Call to API to post a new Favori
  * @param Strategy Favori
  * @returns Observable<Favori>
  */
  postFavorite(monObjet: Favori): Observable<Favori> {
    return this.http.post<Favori>(EndPoint+'Favoris', monObjet, this.Header())
  }
  /**
  * Call to API to modify an existing Favori
  * @param Favori Favori
  * @param id Id of the Favori to modify
  * @returns Observable<Favori>
  */
  putFavoriteById(Favori: Favori, id: number): Observable<Favori> {
    return this.http.put<Favori>(EndPoint+'Favoris/'+id, Favori, this.Header())
  }
  /**
  * Call to API to delete an existing Favori
  * @param id Id of the Favori to delete
  * @returns Observable<Favori>
  */
  deleteFavoriteById(id: number): Observable<Favori> {
    return this.http.delete<Favori>(EndPoint+'Favoris/'+id, this.Header())
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
