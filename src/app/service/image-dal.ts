import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';  
import { catchError } from 'rxjs/operators';
import { Image } from '../models/image';

const EndPoint = "http://localhost:44312/api/";

@Injectable({ providedIn: 'root' })
export class ImageDAL {
    constructor(private http: HttpClient) { }
    uploadImage(image:Image, Token:string):Observable<any> {
        return this.http.post<Image>(EndPoint+'image', image, this. GetHeader(Token));
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

