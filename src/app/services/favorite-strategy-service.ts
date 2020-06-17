import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteStrategy } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';

@Injectable({ providedIn: 'root' })
export class FavoriteStrategyService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all FavoriteStrategy
  * @returns Observable<FavoriteStrategy[]>
  */
  getFavoriteStrategies(): Observable<FavoriteStrategy[]> {
    return this.http.get<FavoriteStrategy[]>(environement.API+'FavoriteStrategy', this.Header())
  }
  /**
  * Call to API to get a FavoriteStrategy depending on his id
  * @param id Id of the FavoriteStrategy
  * @returns Observable<FavoriteStrategy>
  */
  getFavoriteStrategy(id:number): Observable<FavoriteStrategy> {
    return this.http.get<FavoriteStrategy>(environement.API+'FavoriteStrategy/'+id, this.Header())
  }
  /**
  * Call to API to get all FavoriteStrategy depending on user id
  * @param id Id of the User
  * @returns Observable<FavoriteStrategy[]>
  */
  getFavoritestrategiesByUserId(id:number): Observable<FavoriteStrategy[]> {
    return this.http.get<FavoriteStrategy[]>(environement.API+'FavoriteStrategy/UserId='+id, this.Header())
  }
  /**
  * Call to API to post a new FavoriteStrategy
  * @param FavoriteStrategy FavoriteStrategy
  * @returns Observable<FavoriteStrategy>
  */
  postFavoriteStrategy(FavoriteStrategy: FavoriteStrategy): Observable<FavoriteStrategy> {
    return this.http.post<FavoriteStrategy>(environement.API+'FavoriteStrategy', FavoriteStrategy, this.Header())
  }
  /**
  * Call to API to modify an existing FavoriteStrategy
  * @param FavoriteStrategy FavoriteStrategy
  * @param id Id of the FavoriteStrategy to modify
  * @returns Observable<FavoriteStrategy>
  */
  putFavoriteStrategyById(FavorFavoriteStrategyi: FavoriteStrategy, id: number): Observable<FavoriteStrategy> {
    return this.http.put<FavoriteStrategy>(environement.API+'FavoriteStrategy/'+id, FavoriteStrategy, this.Header())
  }
  /**
  * Call to API to delete an existing FavoriteStrategy
  * @param id Id of the FavoriteStrategy to delete
  * @returns Observable<FavoriteStrategy>
  */
  deleteFavoriteStrategyById(id: number): Observable<FavoriteStrategy> {
    return this.http.delete<FavoriteStrategy>(environement.API+'FavoriteStrategy/'+id, this.Header())
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
