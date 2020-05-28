import { Injectable } from '@angular/core';
import { AccessComponent } from './access-component';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class IsAdmin implements CanActivate {
    constructor(private router: Router,private accessService: AccessComponent) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const IsLoggedAsAdmin = this.accessService.CheckAccess("Admin");
        if(!IsLoggedAsAdmin) this.router.navigateByUrl('/');
        else return true;
    }
}
