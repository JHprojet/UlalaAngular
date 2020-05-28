import { Injectable } from '@angular/core';
import { AccessComponent } from './access-component';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class IsToActivate implements CanActivate {
    constructor(private router: Router,private accessService: AccessComponent) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const IsToActivate = this.accessService.CheckAccess("Activation");
        if(!IsToActivate) this.router.navigateByUrl('/');
        else return true;
    }
}