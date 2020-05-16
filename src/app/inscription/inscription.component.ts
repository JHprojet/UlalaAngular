import { Component, OnInit } from '@angular/core';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { AccessComponent } from '../helpeur/access-component';
import { Utilisateur } from '../models/utilisateur';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})

export class InscriptionComponent implements OnInit {
  //Form builder pour l'inscription d'un nouvel utilisateur
  inscriptionForm = this.fb.group({
    pseudo: ['', {
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

  constructor(private utilisateurService:UtilisateurDAL, private fb:FormBuilder, private cv:CustomValidators) { }

  ngOnInit(): void { 
  }
  
  //Action à l'envoi du formulaire
  onSubmit() {
    //Création de l'objet à envoyer vers l'API
    let Inscription:Utilisateur = new Utilisateur({
      Pseudo:this.inscriptionForm.controls.pseudo.value,
      Mail:this.inscriptionForm.controls.email.value,
      Password:this.inscriptionForm.controls.password.value
    });
    //Envoi API
    this.utilisateurService.postUser(Inscription).subscribe(result => { 
      //Si succès
      this.Success = true;
      this.inscriptionForm.reset();
    }, error =>{
      //Si Echec
      this.Success = false;
    });
  }
}
