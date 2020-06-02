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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public data:any=[];
  //A faire : save la langue en session pour gérer prob après connection + bouton à initialisé  à la bonne valeur.
  language:string = 'fr';
  login:string;
  password:string;
  ErrorLogin:boolean = false;
  OkLogin:boolean = false;
  Disconnected:boolean = false;
  MessageLostPassword:boolean = false;
  Fav$:Subject<boolean>;
  Vote$:Subject<boolean>;
  Teams$:Subject<boolean>;
  
  constructor(private accessService:AccessComponent,private translate: TranslateService,private teamService:MesTeamsDAL,private favService:FavoriDAL,private voteService:VoteDAL,private router:Router, private UtilisateurService:UtilisateurDAL) { }
  
  ngOnInit(): void {
    //Get all info from session
    this.data = this.accessService.getSession("All"); 
    //If Language is on Session, reuse, else get Lang of navigator and apply as default
    console.log(this.accessService.getSession("Language"))
    if(this.accessService.getSession("Language")) this.language = this.accessService.getSession("Language");
    else
    {
      let userLang:string = navigator.language;
      if(userLang == 'fr-FR') this.language = 'fr';
      else this.language = 'en';
      this.accessService.setSession('Language',this.language);
    }
    this.translate.setDefaultLang(this.language); 
    this.translate.use(this.language);
  }

  /** Switch language depending on the flag where ths user click. Set language to use and set language in session.
   * @param Language Language to use : 'fr' or 'en'
   */
  ChangeLangage(Language) {
    this.language = Language.value;
    this.translate.use(Language.value);
    this.accessService.setSession('Language',this.language);
  }

  /** Login method (Check Pass-username) and action on Activation needed, login successfull and fail
   */
  Connection() {
    //Init waiting variables
    this.Fav$ = new Subject<boolean>();
    this.Vote$ = new Subject<boolean>();
    this.Teams$ = new Subject<boolean>();
    //Init displaying messages
    this.MessageLostPassword = false;
    this.ErrorLogin = false;
    this.OkLogin = false;
    //Check via API if username and password match
    this.UtilisateurService.CheckUser(new Utilisateur({Pseudo:this.login, Password:this.password})).subscribe(result => {
      //If match
      //Set Token in session and local table (for displaying button purpose)
      this.accessService.setSession("User",result);
      this.data["User"] = result;
      //Get the full user
      this.UtilisateurService.getUserByPseudo(this.login).subscribe(result2 => {
        //If user need to be activated via activation token
        if (result2.ActivationToken != '')
        {
          //Write Id and username in session and local table
          this.accessService.setSession("Id",result2.Id);
          this.accessService.setSession("Pseudo",result2.Pseudo);
          this.data["Id"] = result2.Id;
          this.data["Pseudo"] = result2.Pseudo;
          //Go to activation page
          this.router.navigateByUrl('activation');
        }
        //If user is allready activated
        else
        {
          //Store user information in session and local table
          this.accessService.setSession("Info",result2);
          this.data["Info"] = result2;
          //Get all favorite strategies of user and store
          this.favService.getFavoritesByUserId(result2.Id).subscribe(result => {
            this.accessService.setSession("Fav",result);
            this.Fav$.next(true);
          }, error => {
            this.accessService.setSession("Fav",new Array<Favori>());
            this.Fav$.next(true);
          });
          //Get all votes of user and store
          this.voteService.getVotesByUser(result2.Id).subscribe(result => {
            this.accessService.setSession("Votes",result);
            this.Vote$.next(true);
          }, error => {
            this.accessService.setSession("Votes",new Array<Vote>());
            this.Vote$.next(true);
          });
          //Get all favorite teams of user and store
          this.teamService.getMyTeamsByUserId(result2.Id).subscribe(result => {
            this.accessService.setSession("Teams",result);
            this.Teams$.next(true);
          }, error => {
            this.accessService.setSession("Teams",new Array<MesTeams>());
            this.Teams$.next(true);
          });
          //Display login successfull message for 3 sec
          this.OkLogin = true;
          setTimeout(() => this.OkLogin = false, 3000);
          //When all call to API are done
          zip(this.Fav$,this.Teams$,this.Vote$).subscribe(([Fav, Teams, Vote]) => {
           if(Fav && Teams && Vote) null ; // /!\ TODO Here : Need to refresh current component
          })
        }  
      });
    },error => {
      //If password and username don't match display error messages
      this.MessageLostPassword=true;
      this.ErrorLogin = true;
      setTimeout(() => this.ErrorLogin = false, 3000);
      setTimeout(() => this.MessageLostPassword = false, 7000);
    });
  }

  /** Disconnecting user : Clear all local table and session, then display disconnection successfull and redirect to home page.
   */
  Disconnection()
  {
    this.accessService.deleteSession("All");
    this.data = [];
    this.router.navigateByUrl('/');
    this.Disconnected = true;
    setTimeout(() => this.Disconnected = false, 3000);
  }
}


