import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharactersConfiguration } from "../models";
import { AccessService } from './access-service';
import { environement } from './environement';

@Injectable({ providedIn: 'root' })
export class CharactersConfigurationService {
  constructor(private http: HttpClient,private accessService:AccessService) { }

  /**
  * Call to API to get all CharactersConfiguration
  * @returns Observable<CharactersConfiguration[]>
  */
  getCharactersConfigurations(): Observable<CharactersConfiguration[]> {
    return this.http.get<CharactersConfiguration[]>(environement.API+'CharactersConfiguration', this.Header())
  }
  /**
  * Call to API to get a CharactersConfiguration depending on all 4 classes
  * @param idclasse1 Id of the classe 1
  * @param idclasse2 Id of the classe 2
  * @param idclasse3 Id of the classe 3
  * @param idclasse4 Id of the classe 4
  * @returns Observable<CharactersConfiguration>
  */
  getCharactersConfigurationByClasses(idclasse1:number,idclasse2:number,idclasse3:number,idclasse4:number): Observable<CharactersConfiguration> {
    return this.http.get<CharactersConfiguration>(environement.API+'CharactersConfiguration/'+'?C1='+idclasse1+'&C2='+idclasse2+'&C3='+idclasse3+'&C4='+idclasse4, this.Header())
  }
  /**
  * Call to API to get a CharactersConfiguration depending on his id
  * @param id Id of the CharactersConfiguration
  * @returns Observable<CharactersConfiguration>
  */
  getCharactersConfigurationById(id:number): Observable<CharactersConfiguration> {
    return this.http.get<CharactersConfiguration>(environement.API+'CharactersConfiguration/'+id, this.Header())
  }
  /**
  * Call to API to modify an existing CharactersConfiguration
  * @param CharactersConfiguration CharactersConfiguration
  * @param id Id of the CharactersConfiguration to modify
  * @returns Observable<CharactersConfiguration>
  */
  postCharactersConfiguration(CharactersConfiguration: CharactersConfiguration): Observable<CharactersConfiguration> {
    return this.http.post<CharactersConfiguration>(environement.API+'CharactersConfiguration', CharactersConfiguration, this.Header())
  }
  /**
  * Call to API to modify an existing CharactersConfiguration
  * @param CharactersConfiguration CharactersConfiguration
  * @param id Id of the CharactersConfiguration to modify
  * @returns Observable<CharactersConfiguration>
  */
  putCharactersConfigurationById(CharactersConfiguration: CharactersConfiguration, id:number): Observable<CharactersConfiguration> {
    return this.http.put<CharactersConfiguration>(environement.API+'CharactersConfiguration/'+id, CharactersConfiguration, this.Header())
  }
  /**
  * Call to API to delete an existing CharactersConfiguration
  * @param id Id of the CharactersConfiguration to delete
  * @returns Observable<CharactersConfiguration>
  */
  deleteCharactersConfigurationById(id: number): Observable<CharactersConfiguration> {
    return this.http.delete<CharactersConfiguration>(environement.API+'CharactersConfiguration/'+id, this.Header())
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
