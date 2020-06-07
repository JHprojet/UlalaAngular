import { Injectable } from '@angular/core';
import { AccessService } from './access-service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class IsAnonyme implements CanActivate {
    constructor(private router: Router,private accessService: AccessService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const IsLoggedAsAnonyme = this.accessService.CheckAccess("Anonymous");
        if(!IsLoggedAsAnonyme) {
            this.accessService.getAnonymeKey();
            return true;
        }
        else return true;
    }
}