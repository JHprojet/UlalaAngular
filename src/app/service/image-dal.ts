import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';  
import { catchError } from 'rxjs/operators';
import { Image } from '../models/image';
import { AccessComponent } from '../helpeur/access-component';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class ImageDAL {
  constructor(private http: HttpClient,private accessService:AccessComponent) { }

  /**
  * Call to API to post an image
  * @param image Image
  * @returns Observable<any>
  */
  uploadImage(image:Image):Observable<any> {
      return this.http.post<Image>(EndPoint+'image', image, this.Header());
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

