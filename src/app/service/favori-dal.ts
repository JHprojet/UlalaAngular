import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Favori } from "../models/Favori";
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class FavoriDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  getFavoris(): Observable<Favori[]> {
    return this.http.get<Favori[]>(EndPoint+'Favoris', this.httpOptions)
  }
  getFavori(id:number): Observable<Favori> {
    return this.http.get<Favori>(EndPoint+'Favoris/'+id, this.httpOptions)
  }
  getFavorisByUtilisateurId(id:number): Observable<Favori[]> {
    return this.http.get<Favori[]>(EndPoint+'Favoris/?UtilisateurId='+id, this.httpOptions)
  }
  postFavori(monObjet: Favori): Observable<Favori> {
    return this.http.post<Favori>(EndPoint+'Favoris', monObjet, this.httpOptions)
  }
  putFavori(monObjet: Favori, id: number): Observable<Favori> {
    return this.http.put<Favori>(EndPoint+'Favoris/'+id, monObjet, this.httpOptions)
  }
  deleteFavori(id: number): Observable<Favori> {
    return this.http.delete<Favori>(EndPoint+'Favoris/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
