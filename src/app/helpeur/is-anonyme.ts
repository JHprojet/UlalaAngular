import { Injectable } from '@angular/core';
import { AccessComponent } from './access-component';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class IsAnonyme implements CanActivate {
    constructor(private router: Router,private accessService: AccessComponent) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const IsLoggedAsAnonyme = this.accessService.CheckAccessTest("Anonyme");
        if(!IsLoggedAsAnonyme) {
            this.accessService.getAnonymeKey();
            return true;
        }
        else return true;
    }
}