import { ValidatorFn, AbstractControl, FormGroup, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UtilisateurDAL } from '../utilisateur-dal';
import { Injectable } from '@angular/core';
import { AccessComponent } from 'src/app/helpeur/access-component';
import { Utilisateur } from 'src/app/models/utilisateur';

@Injectable({ providedIn: 'root' })
export class CustomValidators {

    constructor(private utilisateurService:UtilisateurDAL, private accessService:AccessComponent) {}

    //Check mail format
    public EmailValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
        let Re:RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const forbidden = Re.test(control.value);
        return forbidden ? null : {'emailFormat': {value: control.value}};
        };
    }

    

    //Verify that Password and verif password match
    public PasswordMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const password = control.get('password');
        const passwordVerif = control.get('passwordVerif');
    
        return password && passwordVerif && password.value !== passwordVerif.value ? { 'PasswordMatch' : true } : null;
    };

    //Verify that Email and verif Email match
    public EmailMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const email = control.get('email');
        const emailVerif = control.get('emailVerif');
    
        return email && emailVerif && email.value !== emailVerif.value ? { 'EmailMatch' : true } : null;
    };

    public CheckPassword: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        let U = new Utilisateur({Pseudo: this.accessService.getSession("Info").Pseudo, Password:control.value});
        return this.utilisateurService.CheckUser(U).pipe(
            map(() => { return null}),catchError(() => of({'CheckPassword': true}))
        );
    };

    //Check if username allready exist in DB - Async
    public CheckUsername: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.utilisateurService.getUserByPseudo(control.value).pipe(
            map(() => { return {'PseudoExist': true}}),catchError(() => of(null))
        );
    };

    //Check if mail allready exist in DB - Async
    public CheckEmail: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.utilisateurService.getUserByMail(control.value).pipe(
            map(() => { return {'MailExist': true}}),catchError(() => of(null))
        );
    };

    //Check is Continent is feeled with a value
    public CheckContinent: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Continent = control.get('Continent');
        return Continent && (Continent.value == '' || Continent.value == null) ? { 'ContinentIsNeeded' : true } : null;
    };

    //Check is Team is feeled with a value
    public CheckTeam: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Team = control.get('Team');
        return Team && (Team.value == '' || Team.value == null) ? { 'TeamNeeded' : true } : null;
    };

    //If Continent is feeled with a value, Zone must be feeled too
    public CheckZone: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Continent = control.get('Continent');
        const Zone = control.get('Zone');
        return Continent && Continent.value != '' && Zone && Zone.value == '' ? { 'ZoneIsNeeded' : true } : null;
    };

    //If Zone is feeled with a value, Boss must be feeled too
    public CheckBoss: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Boss = control.get('Boss');
        const Zone = control.get('Zone');
        return Zone && Zone.value != '' && Boss && Boss.value == '' ? { 'BossIsNeeded' : true } : null;
    };

    //If Team is feeled with a value, Boss must be feeled too
    public CheckBossWithTeam: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Boss = control.get('Boss');
        const Team = control.get('Team');
        return Team && Team.value != '' && Boss && Boss.value == '' ? { 'BossIsNeeded' : true } : null;
    };

    //Check if 4 classes feeled with value
    public CheckClasses: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const C1 = control.get('Classe1');
        const C2 = control.get('Classe2');
        const C3 = control.get('Classe3');
        const C4 = control.get('Classe4');
        return C1 && C2 && C3 && C4 && (C1.value === '' || C2.value === '' || C3.value === '' || C4.value === '' || C1.value === null || C2.value === null || C3.value === null || C4.value === null) ? { 'AllClassesNeeded' : true } : null;
    };
}

   