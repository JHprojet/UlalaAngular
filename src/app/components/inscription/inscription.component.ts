import { Component, OnInit } from '@angular/core';
import { UserService, CustomValidators } from '../../services';
import { User } from '../../models';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})

export class InscriptionComponent implements OnInit {
  //Form builder pour l'inscription d'un nouvel utilisateur
  inscriptionForm = this.fb.group({
    username: ['', {
      validators: [Validators.required, Validators.maxLength(20), Validators.minLength(3)], 
      asyncValidators : [this.cv.CheckUsername]}],
    email: ['', {
      validators: [Validators.required, this.cv.EmailValidator()],
      asyncValidators : [this.cv.CheckEmail]}],
    emailVerif: ['', { 
      validators: [Validators.required]}],
    password: ['', {
      validators: [Validators.required, Validators.maxLength(40), Validators.minLength(8)]}],
    passwordVerif: ['', {
      validators: [Validators.required]}]
  },{
    updateOn: 'blur', validators: [this.cv.EmailMatch, this.cv.PasswordMatch] });
  Success:boolean;

  constructor(private userService:UserService, private fb:FormBuilder, private cv:CustomValidators) { }

  ngOnInit(): void { 
  }
  
  //Action à l'envoi du formulaire
  onSubmit() {
    //Création de l'objet à envoyer vers l'API
    let Inscription:User = new User({
      Username:this.inscriptionForm.controls.username.value,
      Mail:this.inscriptionForm.controls.email.value,
      Password:this.inscriptionForm.controls.password.value
    });
    //Envoi API
    this.userService.postUser(Inscription).subscribe(result => { 
      //Si succès
      this.Success = true;
      this.inscriptionForm.reset();
    }, error =>{
      //Si Echec
      this.Success = false;
    });
  }
}
