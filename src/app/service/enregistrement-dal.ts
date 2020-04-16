import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Enregistrement } from "../models/enregistrement";


const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class EnregistrementDAL {
    constructor(private http: HttpClient) { }
    
    getEnregistrements(Token:string): Observable<Enregistrement[]> {
        return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement', this.GetHeader(Token))
    }
    getEnregistrement(id:number, Token:string): Observable<Enregistrement> {
        return this.http.get<Enregistrement>(EndPoint+'Enregistrement/'+id, this.GetHeader(Token))
    }
    getEnregistrementsByInfos(U:string, BZ:string, IdC1:string, IdC2:string, IdC3:string, IdC4:string, Token:string): Observable<Enregistrement[]> {
      return this.http.get<Enregistrement[]>(EndPoint+'Enregistrement/?U='+U+'&BZ='+BZ+'&C1='+IdC1+'&C2='+IdC2+'&C3='+IdC3+'&C4='+IdC4, this.GetHeader(Token))
    }
    postEnregistrement(monObjet: Enregistrement, Token:string): Observable<Enregistrement> {
        return this.http.post<Enregistrement>(EndPoint+'Enregistrement', monObjet, this.GetHeader(Token))
    }
    putEnregistrement(monObjet: Enregistrement, id: number, Token:string): Observable<Enregistrement> {
        return this.http.put<Enregistrement>(EndPoint+'Enregistrement/'+id, monObjet, this.GetHeader(Token))
    }
    deleteEnregistrement(id: number, Token:string): Observable<Enregistrement> {
        return this.http.delete<Enregistrement>(EndPoint+'Enregistrement/'+id, this.GetHeader(Token))
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
