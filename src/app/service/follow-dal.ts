import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Follow } from '../models/follow';
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class FollowDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })
  };
  getAllFollow(): Observable<Follow[]> {
    return this.http.get<Follow[]>(EndPoint+'Follow', this.httpOptions)
  }
  getFollowbyFollowedFollower(FollowerId:number, FollowedId:number): Observable<number> {
    return this.http.get<number>(EndPoint+'Follow/?FollowerId='+FollowerId+'&FollowedId='+FollowedId, this.httpOptions)
  }
  getFollow(id:number): Observable<Follow> {
    return this.http.get<Follow>(EndPoint+'Follow/'+id, this.httpOptions)
  }
  postFollow(monObjet: Follow): Observable<Follow> {
    return this.http.post<Follow>(EndPoint+'Follow', monObjet, this.httpOptions)
  }
  deleteFollow(id: number): Observable<Follow> {
    return this.http.delete<Follow>(EndPoint+'Follow/'+id, this.httpOptions)
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
}
