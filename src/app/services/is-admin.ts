import { Injectable } from '@angular/core';
import { AccessService } from './access-service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class IsAdmin implements CanActivate {
    constructor(private router: Router,private accessService: AccessService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const IsLoggedAsAdmin = this.accessService.CheckAccess("Admin");
        if(!IsLoggedAsAdmin) this.router.navigateByUrl('/');
        else return true;
    }
}
