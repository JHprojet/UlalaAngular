import { ValidatorFn, AbstractControl, FormGroup, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UtilisateurDAL } from '../utilisateur-dal';
import { Injectable } from '@angular/core';
import { AccessComponent } from 'src/app/helpeur/access-component';

@Injectable({ providedIn: 'root' })
export class CustomValidators {

    constructor(private utilisateurService:UtilisateurDAL, private accessService:AccessComponent) {}

    //Check format mail
    public EmailValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
        let Re:RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const forbidden = Re.test(control.value);
        return forbidden ? null : {'emailFormat': {value: control.value}};
        };
    }

    //Check Password et verif password match
    public PasswordMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const password = control.get('password');
        const passwordVerif = control.get('passwordVerif');
    
        return password && passwordVerif && password.value !== passwordVerif.value ? { 'PasswordMatch' : true } : null;
    };

    //Check Email et verif Email match
    public EmailMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const email = control.get('email');
        const emailVerif = control.get('emailVerif');
    
        return email && emailVerif && email.value !== emailVerif.value ? { 'EmailMatch' : true } : null;
    };

    //Check si Pseudo déjà utilisé via API - Async
    public CheckPseudo: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.utilisateurService.getUtilisateurByPseudo(control.value, this.accessService.data["Anonyme"]).pipe(
            map(() => { return {'PseudoExist': true}}),catchError(() => of(null))
        );
    };

    //Check si Mail déjà utilisé via API - Async
    public CheckEmail: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.utilisateurService.getUtilisateurByMail(control.value, this.accessService.data["Anonyme"]).pipe(
            map(() => { return {'MailExist': true}}),catchError(() => of(null))
        );
    };
    
}