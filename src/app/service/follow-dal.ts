import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Follow } from '../models/follow';
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class FollowDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  getAllFollow(): Observable<Follow[]> {
    return this.http.get<Follow[]>(EndPoint+'Follow', this.Header())
  }
  getFollowbyFollowedFollower(FollowerId:number, FollowedId:number): Observable<number> {
    return this.http.get<number>(EndPoint+'Follow/?FollowerId='+FollowerId+'&FollowedId='+FollowedId, this.Header())
  }
  getFollow(id:number): Observable<Follow> {
    return this.http.get<Follow>(EndPoint+'Follow/'+id, this.Header())
  }
  postFollow(monObjet: Follow): Observable<Follow> {
    return this.http.post<Follow>(EndPoint+'Follow', monObjet, this.Header())
  }
  deleteFollow(id: number): Observable<Follow> {
    return this.http.delete<Follow>(EndPoint+'Follow/'+id, this.Header())
  }
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
    else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
    return throwError(errorMessage);
  }
  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonyme")??""
    })};
    return httpOptions;
  }
  
}
