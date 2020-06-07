import { Component, OnInit } from '@angular/core';
import { UserService, CustomValidators } from '../../services';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-retrieve-password',
  templateUrl: './retrieve-password.component.html',
  styleUrls: ['./retrieve-password.component.css']
})

export class RetrievePasswordComponent implements OnInit {
  //Retrieve form
  RetrieveForm = this.fb.group({
    email: ['', {
      validators: [Validators.required],
      asyncValidators : [this.cv.CheckEmailExist]}],
  },{
    updateOn: 'blur'});  
  //Variables for displaying messages
  displayError:boolean;
  displaySuccessUsername:boolean;
  displaySuccessPassword:boolean;

  constructor(private cv:CustomValidators,private fb:FormBuilder,private userService:UserService) { }

  ngOnInit(): void {
    //Init displaying variables
    this.displayError = false;
    this.displaySuccessPassword = false;
    this.displaySuccessUsername = false;
  }

  //Call API and send new password by mail
  public GenererPassword()
  {
    this.userService.GenerateAndSendNewPassword(this.RetrieveForm.value.email).subscribe(success => {
      //if success display success message (5s) and reset form.
      this.displaySuccessPassword = true;
      setTimeout(()=> this.displaySuccessPassword = false, 5000);
      this.RetrieveForm.reset();
    }, error => {
      //if error display error message (5s).
      this.displayError = true;
      setTimeout(()=> this.displayError  = false, 5000);
    });
  }

  //Call API and send current username by mail
  public RetrouverPseudo()
  {
      this.userService.FindUsernameByMail(this.RetrieveForm.value.email).subscribe(success => {
        //if success display success message (5s) and reset form.
        this.displaySuccessUsername = true;
        setTimeout(()=> this.displaySuccessUsername = false, 5000);
        this.RetrieveForm.reset();
      }, error => {
        //if error display error message (5s).
        this.displayError = true;
        setTimeout(()=> this.displayError = false, 5000);
      });
  }
}
