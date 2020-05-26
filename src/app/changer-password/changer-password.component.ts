import { Component, OnInit } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { AccessComponent } from '../helpeur/access-component';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';

@Component({
  selector: 'app-changer-password',
  templateUrl: './changer-password.component.html',
  styleUrls: ['./changer-password.component.css']
})
export class ChangerPasswordComponent implements OnInit {

  constructor(private cv:CustomValidators,private fb:FormBuilder, private accessService:AccessComponent,private utilisateurService:UtilisateurDAL) { }
  //Change password Form
  changePasswordForm = this.fb.group({
    currentPassword: ['', { 
      validators: [Validators.required],
      asyncValidators : [this.cv.CheckPassword]
    }],
    password: ['', {
      validators: [Validators.required, Validators.maxLength(40), Validators.minLength(8)]}],
    passwordVerif: ['', {
      validators: [Validators.required]}]
  },{
    updateOn: 'blur', validators: [this.cv.PasswordMatch] });
  //Display on success/error
  displaySuccess:boolean;
  displayError:boolean;

  ngOnInit(): void {
    this.displayError =false;
    this.displaySuccess =false;
  }

  //Send new password
  onSubmit()
  {
    //Hide messages
    this.displaySuccess=false;
    this.displayError=false;
    //Call API
    this.utilisateurService.changePassword(this.accessService.getSession("Info").Id,this.changePasswordForm.value.password).subscribe(result => {
      //If success : reset form + display success message (5s)
      this.changePasswordForm.reset();
      this.displaySuccess=true;
      setTimeout(() => this.displaySuccess=false,5000);
    }, error => {
      //If error : display error message (5s)
      this.displayError=true;
      setTimeout(() => this.displayError=false,5000);
    })
  }
}
