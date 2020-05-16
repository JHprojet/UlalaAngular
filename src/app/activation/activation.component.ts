import { Component, OnInit } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Router } from '@angular/router';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  // Component for the account validation via Token sent by mail

  constructor(private accessService:AccessComponent, private routerService:Router, private utilisateurService:UtilisateurDAL) { }
  
  Username:string; //Username of the User for display in HTML
  Token:string; //Activation Token given by user
  DisplayValidationOk:boolean; //Displaying message if validation OK
  DisplayValidationError:boolean; //Displaying message si validation NOK
  DisplayResendTokenOk:boolean; //Displaying message if sending activation token by mail OK
  DisplayResendTokenError:boolean; //Displaying message if sending activation token by mail NOK

  ngOnInit(): void {
    this.Username = this.accessService.getSession("Pseudo");
    this.Token = '';
    this.DisplayValidationOk = false;
    this.DisplayValidationError = false;
    this.DisplayResendTokenOk = false;
    this.DisplayResendTokenError = false;
  }

  // When activation token send by the user
  // 1 - Hide error messages if displayed
  // 2 - Display a message "Token not valid" if Check in DB = no match.
  // 3 - If Token is valid, connecting user and display a success message (Deleting activation token in DB = Activated).
  // 3a - Delete all used variables from Session and from local table.
  // 3b - Wait 3 secondes and redirect to home page.
  public sendToken()
  {
    this.DisplayValidationOk = false;
    this.DisplayValidationError = false;
    this.utilisateurService.UpdateActivationToken(this.accessService.getSession("Id"), this.Token).subscribe(() => {
      this.utilisateurService.getUser(this.accessService.getSession("Id")).subscribe(result => {
        this.accessService.setSession("Info", result);
        this.accessService.deleteSession("Pseudo");
        this.accessService.deleteSession("Id");
        this.DisplayValidationOk = true;
        setTimeout(() => {
          this.DisplayValidationOk = false;
          this.routerService.navigateByUrl('');
        },3000);
      });
    }, error => { this.DisplayValidationError = true; })
  }

  // If User ask to resend Token by mail
  // 1 - Hide error messages if displayed
  // 2 - Display message "Token resend by mail" if success returned by API (delete in 5s).
  // 3 - Display error message if error return by API (delete in 10s).
  public ResendTokenByEmail()
  {
    this.DisplayResendTokenOk = false;
    this.DisplayResendTokenError = false;
    this.utilisateurService.ResendToken(this.accessService.getSession("Id")).subscribe(success =>{
      this.DisplayResendTokenOk = true;
      setTimeout(() => { 
        this.DisplayResendTokenOk = false; },5000);
    }, error => {
      this.DisplayResendTokenError = true;
      setTimeout(() => { this.DisplayResendTokenError = false; },10000);
    })
  }
}
