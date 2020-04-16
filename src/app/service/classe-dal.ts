import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Classe } from "../models/Classe";

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class ClasseDAL {
    constructor(private http: HttpClient) { }
    getClasses(Token:string): Observable<Classe[]> {
        return this.http.get<Classe[]>(EndPoint+'Classe', this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    getClasse(id:number, Token:string): Observable<Classe> {
        return this.http.get<Classe>(EndPoint+'Classe/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    postClasse(monObjet: Classe, Token:string): Observable<Classe> {
        return this.http.post<Classe>(EndPoint+'Classe', monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    putClasse(monObjet: Classe, id: number, Token:string): Observable<Classe> {
        return this.http.put<Classe>(EndPoint+'Classe/'+id, monObjet, this.GetHeader(Token)).pipe(catchError(this.handleError))
    }
    deleteClasse(id: number, Token:string): Observable<Classe> {
        return this.http.delete<Classe>(EndPoint+'Classe/'+id, this.GetHeader(Token)).pipe(catchError(this.handleError))
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
