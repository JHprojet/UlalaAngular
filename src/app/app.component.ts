import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user-service';
import { Router } from '@angular/router';
import { AccessService } from './services/access-service';
import { VoteService } from './services/vote-service';
import { FavoriteStrategyService } from './services/favorite-strategy-service';
import { TeamService } from './services/team-service';
import { Subject, zip } from 'rxjs';
import { FavoriteStrategy } from './models/favorite-strategy';
import { Vote } from './models/vote';
import { Team } from './models/team';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data:any=[];
  language:string;
  login:string;
  password:string;
  ErrorLogin:boolean = false;
  OkLogin:boolean = false;
  Disconnected:boolean = false;
  MessageLostPassword:boolean = false;
  Fav$:Subject<boolean>;
  Vote$:Subject<boolean>;
  Teams$:Subject<boolean>;
  
  constructor(private accessService:AccessService,private translate: TranslateService,private teamService:TeamService,
    private favService:FavoriteStrategyService,private voteService:VoteService,private router:Router, private userService:UserService) { }
  
  ngOnInit(): void {
    //Get all info from session
    this.data["Info"] = this.accessService.getSession("Info");
    //If Language is on Session, reuse, else get Lang of navigator and apply as default
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
    this.userService.CheckUser(new User({Username:this.login, Password:this.password})).subscribe(result => {
      //If match
      //Set Token in session and local table (for displaying button purpose)
      this.accessService.setSession("User",result);
      this.data["User"] = result;
      //Get the full user

      this.userService.getUserByPseudo(this.login).subscribe(result2 => {
        //If user need to be activated via activation token
        if (result2.ActivationToken != "")
        {
          //Write Id and username in session and local table
          this.accessService.setSession("Id",result2.Id);
          this.accessService.setSession("Pseudo",result2.Username);
          this.data["Id"] = result2.Id;
          this.data["Pseudo"] = result2.Username;
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
          this.favService.getFavoritestrategiesByUserId(result2.Id).subscribe(result => {
            this.accessService.setSession("Fav",result);
            this.Fav$.next(true);
          }, error => {
            this.accessService.setSession("Fav",new Array<FavoriteStrategy>());
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
          this.teamService.getTeamsByUserId(result2.Id).subscribe(result => {
            this.accessService.setSession("Teams",result);
            this.Teams$.next(true);
          }, error => {
            this.accessService.setSession("Teams",new Array<Team>());
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


