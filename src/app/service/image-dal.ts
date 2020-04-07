import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';  
import { catchError } from 'rxjs/operators';
import { Image } from '../models/image';

const EndPoint = "http://localhost:44312/api/";
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
      //'Authorization': 'mon-jeton'
    })
  };

@Injectable({ providedIn: 'root' })
export class ImageDAL {
    constructor(private http: HttpClient) { }
    uploadImage(image:Image):Observable<any> {
      console.log(image.fileName); 
        return this.http.post<Image>(EndPoint+'image', image, httpOptions).pipe(catchError(this.handleError));
      }
      handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) { errorMessage = `Error: ${error.error.message}`; } 
        else { errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; }
        window.alert(errorMessage);
        return throwError(errorMessage);
      }
    }

