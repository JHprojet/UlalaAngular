import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Favori } from "../models/Favori";

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class FavoriDAL {
    constructor(private http: HttpClient) { }
    getFavoris(Token:string): Observable<Favori[]> {
        return this.http.get<Favori[]>(EndPoint+'Favoris', this.GetHeader(Token))
    }
    getFavori(id:number, Token:string): Observable<Favori> {
        return this.http.get<Favori>(EndPoint+'Favoris/'+id, this.GetHeader(Token))
    }
    getFavorisByUtilisateurId(id:number, Token:string): Observable<Favori[]> {
      return this.http.get<Favori[]>(EndPoint+'Favoris/?UtilisateurId='+id, this.GetHeader(Token))
    }
    postFavori(monObjet: Favori, Token:string): Observable<Favori> {
        return this.http.post<Favori>(EndPoint+'Favoris', monObjet, this.GetHeader(Token))
    }
    putFavori(monObjet: Favori, id: number, Token:string): Observable<Favori> {
        return this.http.put<Favori>(EndPoint+'Favoris/'+id, monObjet, this.GetHeader(Token))
    }
    deleteFavori(id: number, Token:string): Observable<Favori> {
        return this.http.delete<Favori>(EndPoint+'Favoris/'+id, this.GetHeader(Token))
      }
    handleError(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
      else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
      return throwError(errorMessage);
    }
    GetHeader(Token?:string)
    {
      let tok = Token??""
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization' : tok
        })
      };
      return httpOptions;
    }
}
