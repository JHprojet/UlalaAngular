import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Follow } from '../models';
import { AccessService } from './access-service';
import { environement } from './environement';
  
@Injectable({ providedIn: 'root' })
export class FollowService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all Follow
  * @returns Observable<Follow[]>
  */
  getAllFollow(): Observable<Follow[]> {
    return this.http.get<Follow[]>(environement.API+'Follow', this.Header())
  }
  /**
  * Call to API to get a Follow depending Follower and Followed id
  * @param FollowerId Id of the Follower
  * @param FollowedId Id of the Followed
  * @returns Observable<Follow>
  */
  getFollowbyFollowedFollower(FollowerId:number, FollowedId:number): Observable<number> {
    return this.http.get<number>(environement.API+'Follow/FollowerId='+FollowerId+'/FollowedId='+FollowedId, this.Header())
  }
  /**
  * Call to API to get a Follow depending on his id
  * @param id Id of the Follow
  * @returns Observable<Follow>
  */
  getFollow(id:number): Observable<Follow> {
    return this.http.get<Follow>(environement.API+'Follow/'+id, this.Header())
  }
  /**
  * Call to API to modify an existing Follow
  * @param Follow Follow
  * @param id Id of the Follow to modify
  * @returns Observable<Follow>
  */
  postFollow(Follow: Follow): Observable<Follow> {
    return this.http.post<Follow>(environement.API+'Follow', Follow, this.Header())
  }
  /**
  * Call to API to delete an existing Follow
  * @param id Id of the Follow to delete
  * @returns Observable<Follow>
  */
  deleteFollow(id: number): Observable<Follow> {
    return this.http.delete<Follow>(environement.API+'Follow/'+id, this.Header())
  }
  /**
  * Create the httpOptions header with Authorization
  * @returns httpOptions
  */
  private Header() {
    let httpOptions = { headers : new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization' : this.accessService.getSession("User")??this.accessService.getSession("Anonymous")??""
    })};
    return httpOptions;
  }
  
}
