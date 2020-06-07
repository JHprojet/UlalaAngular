import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { Image } from '../models';
import { AccessService } from './access-service';
import { environement } from './environement';


@Injectable({ providedIn: 'root' })
export class ImageService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to post an image
  * @param image Image
  * @returns Observable<any>
  */
  uploadImage(image:Image):Observable<any> {
      return this.http.post<Image>(environement.API+'image', image, this.Header());
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

