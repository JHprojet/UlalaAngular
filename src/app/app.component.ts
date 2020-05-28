import { Component, OnInit } from '@angular/core';
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
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public data:any=[];
  //A faire : save la langue en session pour gérer prob après connection + bouton à initialisé  à la bonne valeur.
  langage:string = 'fr';
  login:string;
  password:string;
  ErrorLogin:boolean = false;
  OkLogin:boolean = false;
  Disconnected:boolean = false;
  MessageRecupPassword:boolean = false;
  Fav$:Subject<boolean>;
  Vote$:Subject<boolean>;
  Teams$:Subject<boolean>;

  constructor(private accessService:AccessComponent,private translate: TranslateService,private teamService:MesTeamsDAL,private favService:FavoriDAL,private voteService:VoteDAL,private router:Router, private UtilisateurService:UtilisateurDAL) { }
  
  ngOnInit(): void {
    this.data = this.accessService.getSession("All");
    this.translate.setDefaultLang(this.langage);
    this.translate.use(this.langage);
  }

  ChangeLangage(Langage) {
    this.langage = Langage.value;
    this.translate.use(Langage.value);
  }
  
  Connection() {
    this.Fav$ = new Subject<boolean>();
    this.Vote$ = new Subject<boolean>();
    this.Teams$ = new Subject<boolean>();
    this.MessageRecupPassword = false;
    this.ErrorLogin = false;
    this.OkLogin = false;
    this.UtilisateurService.CheckUser(new Utilisateur({Pseudo:this.login, Password:this.password})).subscribe(result => {
      this.accessService.setSession("User",result);
      
      this.data["User"] = result;
      this.UtilisateurService.getUserByPseudo(this.login).subscribe(result2 => {
        if (result2.ActivationToken != '')
        {
          this.accessService.setSession("Id",result2.Id);
          this.accessService.setSession("Pseudo",result2.Pseudo);
          this.data["Id"] = this.accessService.getSession("Id");
          this.data["Pseudo"] = this.accessService.getSession("Pseudo");
          this.router.navigateByUrl('activation');
        }
        else
        {
          this.accessService.setSession("Info",result2);
          this.data["Info"] = result2;
          this.favService.getFavoritesByUserId(result2.Id).subscribe(result => {
            this.accessService.setSession("Fav",result);
            this.Fav$.next(true);
          }, error => {
            this.accessService.setSession("Fav",new Array<Favori>());
            this.Fav$.next(true);
          });
          this.voteService.getVotesByUser(result2.Id).subscribe(result => {
            this.accessService.setSession("Votes",result);
            this.Vote$.next(true);
          }, error => {
            this.accessService.setSession("Votes",new Array<Vote>());
            this.Vote$.next(true);
          });
          this.teamService.getMyTeamsByUserId(result2.Id).subscribe(result => {
            this.accessService.setSession("Teams",result);
            this.Teams$.next(true);
          }, error => {
            this.accessService.setSession("Teams",new Array<MesTeams>());
            this.Teams$.next(true);
          });
          this.OkLogin = true;
          setTimeout(() => this.OkLogin = false, 3000);
          //A faire : trouver un moyen de call le ngoninit du component actuel
          zip(this.Fav$,this.Teams$,this.Vote$).subscribe(([Fav, Teams, Vote]) => {
           if(Fav && Teams && Vote) setTimeout(() => { location.reload() },50000) ;
          })
        }  
      });
    },error => {
      this.MessageRecupPassword=true;
      this.ErrorLogin = true;
      setTimeout(() => this.ErrorLogin = false, 3000);
      setTimeout(() => this.MessageRecupPassword = false, 7000);
    });
  }

  Disconnection()
  {
    this.accessService.deleteSession("All");
    this.data = [];
    this.router.navigateByUrl('/');
    this.Disconnected = true;
    setTimeout(() => this.Disconnected = false, 3000);
  }
}


