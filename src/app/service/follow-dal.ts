import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Follow } from '../models/follow';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class FollowDAL {
    constructor(private http: HttpClient) { }
    getAllFollow(Token:string): Observable<Follow[]> {
        return this.http.get<Follow[]>(EndPoint+'Follow', this.GetHeader(Token))
    }
    getFollowbyFollowedFollower(FollowerId:number, FollowedId:number, Token:string): Observable<number> {
      return this.http.get<number>(EndPoint+'Follow/?FollowerId='+FollowerId+'&FollowedId='+FollowedId, this.GetHeader(Token))
    }
    getFollow(id:number, Token:string): Observable<Follow> {
        return this.http.get<Follow>(EndPoint+'Follow/'+id, this.GetHeader(Token))
    }
    postFollow(monObjet: Follow, Token:string): Observable<Follow> {
        return this.http.post<Follow>(EndPoint+'Follow', monObjet, this.GetHeader(Token))
    }
    deleteFollow(id: number, Token:string): Observable<Follow> {
        return this.http.delete<Follow>(EndPoint+'Follow/'+id, this.GetHeader(Token))
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
