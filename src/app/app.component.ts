import { Component } from '@angular/core';
import { Utilisateur } from './models/utilisateur';
import { UtilisateurDAL } from './service/utilisateur-dal';
import { Router } from '@angular/router';
import { AccessComponent } from './helpeur/access-component';
import { VoteDAL } from './service/vote-dal';
import { FavoriDAL } from './service/favori-dal';
import { MesTeamsDAL } from './service/mesteams-dal';
import { Subject, zip } from 'rxjs';
import { Favori } from './models/Favori';
import { Vote } from './models/vote';
import { MesTeams } from './models/mes-teams';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public data:any=[];
  login:string;
  password:string;
  ErrorLogin:string = "";
  OkLogin:string ="";
  NotConnected:string="";
  Disconnected:string="";
  MessageRecupPassword:string="";
  Fav$:Subject<boolean>;
  Vote$:Subject<boolean>;
  Teams$:Subject<boolean>;

  constructor(private teamService:MesTeamsDAL,private favService:FavoriDAL,private voteService:VoteDAL,private accessService:AccessComponent,private router:Router, private UtilisateurService:UtilisateurDAL) { 
    this.accessService.getSession("Info");
    this.accessService.getAnonymeKey();
    this.data = this.accessService.data;
  }

  Connection()
  {
    this.Fav$ = new Subject<boolean>();
    this.Vote$ = new Subject<boolean>();
    this.Teams$ = new Subject<boolean>();
    this.MessageRecupPassword="";
    this.ErrorLogin = "";
    this.OkLogin = "";
    this.UtilisateurService.CheckUser(new Utilisateur({Pseudo:this.login, Password:this.password})).subscribe(result => {
      this.accessService.setSession("User",result);
      
      this.data["User"] = this.accessService.getSession("User");
      this.UtilisateurService.getUtilisateurByPseudo(this.login).subscribe(result2 => {
        if (result2.ActivationToken != '')
        {
          this.accessService.setSession("Id",result2.Id);
          this.accessService.setSession("Pseudo",result2.Pseudo);
          this.data["Id"] = this.accessService.data["Id"];
          this.data["Pseudo"] = this.accessService.data["Pseudo"];
          this.router.navigateByUrl('activation');
        }
        else
        {
          this.accessService.setSession("Info",result2);
          this.data["Info"] = this.accessService.data["Info"];
          this.favService.getFavorisByUtilisateurId(this.data["Info"].Id).subscribe(result => {
            this.accessService.setSession("Fav",result);
            this.Fav$.next(true);
          }, error => {
            this.accessService.setSession("Fav",new Array<Favori>());
            this.Fav$.next(true);
          });
          this.voteService.getVotesByUser(this.data["Info"].Id).subscribe(result => {
            this.accessService.setSession("Votes",result);
            this.Vote$.next(true);
          }, error => {
            this.accessService.setSession("Votes",new Array<Vote>());
            this.Vote$.next(true);
          });
          this.teamService.getMeTeamsByUserId(this.data["Info"].Id).subscribe(result => {
            this.accessService.setSession("Teams",result);
            this.Teams$.next(true);
          }, error => {
            this.accessService.setSession("Teams",new Array<MesTeams>());
            this.Teams$.next(true);
          });
          this.OkLogin = "Connexion réussie.";
          setTimeout(() => this.OkLogin = "", 3000);
          //A faire : trouver un moyen de call le ngoninit du component actuel
          zip(this.Fav$,this.Teams$,this.Vote$).subscribe(([Fav, Teams, Vote]) => {
            if(Fav && Teams && Vote) location.reload();
          })
        }  
      });
    },error => {
      this.MessageRecupPassword="Perdu votre mot de passe ou votre pseudo? Cliquez ici!";
      this.ErrorLogin = "Utilisateur ou Mot de passe invalide";
      setTimeout(() => this.ErrorLogin = "", 3000);
      setTimeout(() => this.MessageRecupPassword = "", 7000);
    });
  }

  Disconnection()
  {
    this.accessService.deleteSession("Info");
    this.accessService.deleteSession("User");
    delete this.data["Info"];
    delete this.data["User"];
    this.router.navigateByUrl('/');
    this.Disconnected = "Vous avez bien été déconnecté.";
    setTimeout(() => this.Disconnected = "", 3000);
  }
}


