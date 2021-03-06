import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services';
import { User } from '../../models';
import { zip, Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../services/validators';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  constructor(private cd:ChangeDetectorRef, private fb:FormBuilder, private v:CustomValidators,private userService:UserService) { }
  //All Users
  BaseUsers:User[];
  //Users send to Pagination component
  Users:User[];
  //Users displayed depending on the pagination
  displayUsers:User[];
  //Variable to fill role selection
  SelectRole:string[];
  //Variable displaying edit form
  edit:boolean;
  //Displaying or not messages
  displayUsernameTaken:boolean;
  displayMailTaken:boolean;
  displayError:boolean;
  displaySuccess:boolean;
  displayNoUserFound:boolean;
  //Form for the search filter
  SearchForm = this.fb.group({
    mail: [''],
    username: [''],
    role: ['']
  },{
    updateOn: 'change'});
  //Form to edit a User
  EditForm = this.fb.group({
    username: ['', { 
      validators: [Validators.required, Validators.maxLength(20), Validators.minLength(3)]
    }],
    mail: ['', { 
      validators: [Validators.required, this.v.EmailValidator]
    }],
    id: [''],
    active: [''],
    role:['']
  },{
    updateOn: 'blur', validators: [], asynchValidators : []});

  ngOnInit(): void {
    this.displayNoUserFound = false;
    this.edit = false;
    this.Users = new Array<User>();
    this.BaseUsers = new Array<User>();
    this.displayUsers = new Array<User>();
    this.SelectRole = ["User", "Admin"];
    this.displayNoUserFound = false;
    this.displaySuccess = false;
    this.displayError = false;
    this.userService.getUsers().subscribe(result => {
      this.BaseUsers = result;
      this.Users = result;
    });
  }

  //Update table depending on PaginatorComponent
  public getPagTable(data) {
    this.displayUsers = data;
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  search() {
    this.displayNoUserFound = false;
    //Filter the user table depending on SearchForm
    this.Users = this.BaseUsers.filter(result => result.Role.includes(this.SearchForm.value.role) && result.Mail.includes(this.SearchForm.value.mail) && result.Username.includes(this.SearchForm.value.username))
    //Display message if no user found
    if (this.Users.length == 0) this.displayNoUserFound = true;
  }

  //Action on edition
  Edit(id) {
    //turn edit to true to show the editForm.
    this.edit = true;
    //Get User by Id (from Edit button)
    this.userService.getUserAdmin(id).subscribe(result => {
      //Auto fill informations of the form
      this.EditForm.controls.id.setValue(result.Id);
      this.EditForm.controls.username.setValue(result.Username);
      this.EditForm.controls.mail.setValue(result.Mail);
      this.EditForm.controls.role.setValue(result.Role);
      this.EditForm.controls.active.setValue(result.Active);
    });
  }

  //Send the edited user
  Update() {
    //Hiding error messages
    this.displayUsernameTaken = false;
    this.displayMailTaken = false;
    //Initializing waiting variables
    let checkUser$ = new Subject<boolean>();
    let checkMail$ = new Subject<boolean>();
    //Checking if User and Mail not allready in use on other users
    this.checkUser(checkUser$);
    this.checkMail(checkMail$);
    //When both check are done
    zip(checkUser$,checkMail$).subscribe(([checkU, checkM]) => {
      if(!checkU) this.displayUsernameTaken = true;
      if(!checkM) this.displayMailTaken = true;
      if(checkU && checkM)
      {
        //fill the user to edit with current informations
        let UserToEdit = new User({
          Id : this.EditForm.value.id,
          Username : this.EditForm.value.username,
          Mail: this.EditForm.value.mail,
          Role : this.EditForm.value.role,
          Active : this.EditForm.value.active
        });
        //Call API for update
        this.userService.putUserById(UserToEdit, UserToEdit.Id).subscribe(() => {
          //If success, display message + update local tables + hide EditForm
          this.displaySuccess = true;
          this.BaseUsers[this.BaseUsers.findIndex(user => user.Id == this.EditForm.value.id)] = UserToEdit;
          this.search();
          this.edit = false;
          setTimeout(() => { this.displaySuccess =false; },4000)
        }, error => {
          //If error, display error message
          this.displayError = true;
          setTimeout(() => { this.displayError = false; },4000)
        });
      }
    });
  }

  //Check if username is already taken in another user
  checkUser(sub:Subject<boolean>)
  {
    this.userService.getUserByPseudo(this.EditForm.value.username).subscribe(result => {
      if(this.EditForm.value.id == result.Id) sub.next(true);
      else sub.next(false);
    }, error => {sub.next(true)});
  }

  //Check if mail is already taken in another user
  checkMail(sub:Subject<boolean>)
  {
    this.userService.getUserByMail(this.EditForm.value.mail).subscribe(result => {
      if(this.EditForm.value.id == result.Id) sub.next(true);
      else sub.next(false);
    }, error => {sub.next(true)});
  }
}

