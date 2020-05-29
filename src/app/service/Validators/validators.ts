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

    /** Validators for FB : Check mail format */
    public EmailValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
        let Re:RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const forbidden = Re.test(control.value);
        return forbidden ? null : {'emailFormat': {value: control.value}};
        };
    }

    /** Validators for FB : Check if both password are identical */
    public PasswordMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const password = control.get('password');
        const passwordVerif = control.get('passwordVerif');
    
        return password && passwordVerif && password.value !== passwordVerif.value ? { 'PasswordMatch' : true } : null;
    };

    /** Validators for FB : Check if both Email are identical */
    public EmailMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const email = control.get('email');
        const emailVerif = control.get('emailVerif');
    
        return email && emailVerif && email.value !== emailVerif.value ? { 'EmailMatch' : true } : null;
    };

    /** Async Validators for FB : Check if password is the same in DB */
    public CheckPassword: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        let U = new Utilisateur({Pseudo: this.accessService.getSession("Info").Pseudo, Password:control.value});
        return this.utilisateurService.CheckUser(U).pipe(
            map(() => { return null }),catchError(() => of({'CheckPassword': true}))
        );
    };

    /** Async Validators for FB : Check if username allready exist in DB */
    public CheckUsername: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.utilisateurService.getUserByPseudo(control.value).pipe(
            map(() => { return {'PseudoExist': true}}),catchError(() => of(null))
        );
    };

    /** Async Validators for FB : Check if mail allready exist in DB - return error if allready exist */
    public CheckEmail: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.utilisateurService.getUserByMail(control.value).pipe(
            map(() => { return {'MailExist': true}}),catchError(() => of(null))
        );
    };

    /** Async Validators for FB : Check if mail allready exist in DB - return error if don't exist */
    public CheckEmailExist: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.utilisateurService.getUserByMail(control.value).pipe(
            map(() => { return null}),catchError(() => of({'MailExist': true}))
        );
    };

    /** Validators for FB : Check if Continent is selected */
    public CheckContinent: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Continent = control.get('Continent');
        return Continent && (Continent.value == '' || Continent.value == null) ? { 'ContinentIsNeeded' : true } : null;
    };

    /** Validators for FB : Check if a team is selected */
    public CheckTeam: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Team = control.get('Team');
        return Team && (Team.value == '' || Team.value == null) ? { 'TeamNeeded' : true } : null;
    };

    /** Validators for FB : Check if Zone is selected when Continent is selected */
    public CheckZone: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Continent = control.get('Continent');
        const Zone = control.get('Zone');
        return Continent && Continent.value != '' && Zone && Zone.value == '' ? { 'ZoneIsNeeded' : true } : null;
    };
    
    /** Validators for FB : Check if boss is selected when Zone is selected */
    public CheckBoss: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Boss = control.get('Boss');
        const Zone = control.get('Zone');
        return Zone && Zone.value != '' && Boss && Boss.value == '' ? { 'BossIsNeeded' : true } : null;
    };

    /** Validators for FB : Check if boss is selected when a team is selected */
    public CheckBossWithTeam: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const Boss = control.get('Boss');
        const Team = control.get('Team');
        return Team && Team.value != '' && Boss && Boss.value == '' ? { 'BossIsNeeded' : true } : null;
    };

    /** Validators for FB : Check if all 4 classes selected */
    public CheckClasses: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
        const C1 = control.get('Classe1');
        const C2 = control.get('Classe2');
        const C3 = control.get('Classe3');
        const C4 = control.get('Classe4');
        return C1 && C2 && C3 && C4 && (C1.value === '' || C2.value === '' || C3.value === '' || C4.value === '' || C1.value === null || C2.value === null || C3.value === null || C4.value === null) ? { 'AllClassesNeeded' : true } : null;
    };
}

   