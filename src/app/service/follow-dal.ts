import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Follow } from '../models/follow';
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";
  
@Injectable({ providedIn: 'root' })
export class FollowDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  /**
  * Call to API to get all Follow
  * @returns Observable<Follow[]>
  */
  getAllFollow(): Observable<Follow[]> {
    return this.http.get<Follow[]>(EndPoint+'Follow', this.Header())
  }
  /**
  * Call to API to get a Follow depending Follower and Followed id
  * @param FollowerId Id of the Follower
  * @param FollowedId Id of the Followed
  * @returns Observable<Follow>
  */
  getFollowbyFollowedFollower(FollowerId:number, FollowedId:number): Observable<number> {
    return this.http.get<number>(EndPoint+'Follow/?FollowerId='+FollowerId+'&FollowedId='+FollowedId, this.Header())
  }
  /**
  * Call to API to get a Follow depending on his id
  * @param id Id of the Follow
  * @returns Observable<Follow>
  */
  getFollow(id:number): Observable<Follow> {
    return this.http.get<Follow>(EndPoint+'Follow/'+id, this.Header())
  }
  /**
  * Call to API to modify an existing Follow
  * @param Follow Follow
  * @param id Id of the Follow to modify
  * @returns Observable<Follow>
  */
  postFollow(Follow: Follow): Observable<Follow> {
    return this.http.post<Follow>(EndPoint+'Follow', Follow, this.Header())
  }
  /**
  * Call to API to delete an existing Follow
  * @param id Id of the Follow to delete
  * @returns Observable<Follow>
  */
  deleteFollow(id: number): Observable<Follow> {
    return this.http.delete<Follow>(EndPoint+'Follow/'+id, this.Header())
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
