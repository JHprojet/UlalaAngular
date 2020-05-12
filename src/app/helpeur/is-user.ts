import { Injectable } from '@angular/core';
import { AccessComponent } from './access-component';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class IsUser implements CanActivate {
    constructor(private router: Router,private accessService: AccessComponent) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const IsLoggedAsUser = this.accessService.CheckAccessTest("User");
        if(!IsLoggedAsUser) this.router.navigateByUrl('/');
        else return true;
    }
}