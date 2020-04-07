import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Favori } from "../models/Favori";

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };
  
@Injectable({ providedIn: 'root' })
export class FavoriDAL {
    constructor(private http: HttpClient) { }
    getFavoris(): Observable<Favori[]> {
        return this.http.get<Favori[]>(EndPoint+'Favoris').pipe( catchError(this.handleError))
    }
    getFavori(id:number): Observable<Favori> {
        return this.http.get<Favori>(EndPoint+'Favoris/'+id).pipe( catchError(this.handleError))
    }
    getFavorisByUtilisateurId(id:number): Observable<Favori[]> {
      return this.http.get<Favori[]>(EndPoint+'Favoris/?UtilisateurId='+id).pipe( catchError(this.handleError))
    }
    postFavori(monObjet: Favori): Observable<Favori> {
        return this.http.post<Favori>(EndPoint+'Favoris', monObjet, httpOptions).pipe(catchError(this.handleError))
    }
    putFavori(monObjet: Favori, id: number): Observable<Favori> {
        return this.http.put<Favori>(EndPoint+'Favoris/'+id, monObjet ,httpOptions).pipe(catchError(this.handleError))
    }
    deleteFavori(id: number): Observable<Favori> {
        return this.http.delete<Favori>(EndPoint+'Favoris/'+id ,httpOptions).pipe(catchError(this.handleError))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      return throwError(errorMessage);
    }
}
