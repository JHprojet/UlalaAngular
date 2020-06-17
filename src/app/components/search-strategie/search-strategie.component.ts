import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { zip, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators, AccessService, BossesPerZoneService, FavoriteStrategyService, StrategyService,
         ClasseService, VoteService, environement } from '../../services';
import { Classe, BossesPerZone, Team, Strategy, FavoriteStrategy, Vote, User } from '../../models';

@Component({
  selector: 'app-search-strategie',
  templateUrl: './search-strategie.component.html',
  styleUrls: ['./search-strategie.component.css']
})
export class SearchStrategieComponent implements OnInit {
  //Research form with custom parameters
  SearchForm = this.fb.group({
    Continent: ['', {
      validators: [Validators.required]}],
    Zone: ['', {
      validators: [Validators.required]}],
    Boss: ['', {
      validators: [Validators.required]}],
    Classe1: [''],
    Classe2: [''],
    Classe3: [''],
    Classe4: ['']
  },{
    updateOn: 'change', validators: [this.v.CheckZone, this.v.CheckBoss]});
  //Research form with personal Team  
  SearchFormWithTeam = this.fb.group({
    Team: ['', {
      validators: [Validators.required]}],
    Boss: ['', {
      validators: [Validators.required]}]
  },{
    updateOn: 'change', validators: [this.v.CheckBossWithTeam]});

  constructor(private translate:TranslateService, private cd:ChangeDetectorRef, private voteService:VoteService,private favService:FavoriteStrategyService,
    private v:CustomValidators,private activatedRoute:ActivatedRoute,private stratService:StrategyService,
    private classeService:ClasseService,private bzService:BossesPerZoneService,private accessService:AccessService,
    private fb:FormBuilder, private cv:CustomValidators) { }
    
  //Variable containing all BossZone
  AllBossZone:BossesPerZone[] = new Array<BossesPerZone>();
  //Variable for the display of enregistrement depending on paginatorComponent
  displayStrategies:Strategy[] = new Array<Strategy>();
  //Variable to fill in selects
  selectContinent:BossesPerZone[] = new Array<BossesPerZone>();
  selectZone:BossesPerZone[] = new Array<BossesPerZone>();
  selectBoss:BossesPerZone[] = new Array<BossesPerZone>();
  selectClasse:Classe[] = new Array<Classe>();
  selectTeams:Team[] = new Array<Team>();
  //is the user connected
  accessUser:boolean = false;
  //Displaying help
  Show:boolean = false;
  //Variable displaying the choosen Form
  SearchWithTeam:boolean = false;
  //current Route
  currentRoute:string;
  //Variable displaying if no enregistrement found
  DisplayNoStrategyMessage:boolean = false;
  //Variable with all votes and favori of the user
  myVotes:Vote[];
  myFavs:FavoriteStrategy[];
  //Language
  Lang:string;
  //EndPoint image server
  BaseURL:string;
  //Getter and Setter for strategies (The getter allow to filter strategy depending on route)
  private _strategies: Strategy[];
  get Strategies():Strategy[] {
    
    if (this.currentRoute == "favstrat")
    {
      let newTab:Strategy[] = new Array<Strategy>();
      for (let elem of this._strategies)
      {
        for (let fav of this.myFavs) 
        {
          if (elem && fav.Strategy && elem.Id == fav.Strategy.Id) newTab.push(elem);
        }
      }
      return newTab;
    }
    else return this._strategies;
  };
  set Strategies(P:Strategy[]) {
    this._strategies = P;
  }
  
  ngOnInit(): void {
    this.BaseURL = environement.ImagePath;
    //Get language
    this.Lang = this.translate.currentLang;
    //get current route
    this.activatedRoute.url.subscribe(params => {
      this.currentRoute = params[0].path;
    })
    //init to disbale some form parts
    this.SearchFormWithTeam.get('Boss').disable();
    this.SearchForm.get('Boss').disable();
    this.SearchForm.get('Zone').disable();
    //If a user is connected, get his teams, Favori and Votes.
    if(this.accessService.getSession("Info")) {
      this.accessUser = true;
      if(this.accessService.getSession("Teams")) this.selectTeams = this.accessService.getSession("Teams");
      else this.selectTeams = new Array<Team>();
      if(this.accessService.getSession("Fav"))  this.myFavs = this.accessService.getSession("Fav");
      else  this.myFavs = new Array<FavoriteStrategy>();
      if(this.accessService.getSession("Votes")) this.myVotes = this.accessService.getSession("Votes");
      else this.myVotes = new Array<Vote>();
    }
    //Get all BossZone list
    this.bzService.getBossesPerZones().subscribe(result => {
      this.AllBossZone = result;
      //Fill in selectContinent with unique Continent values
      var unique = [];
      for( let i = 0; i < result.length; i++ ) {
        if( !unique[result[i].Zone.ContinentFR]) {
          this.selectContinent.push(result[i]);
          unique[result[i].Zone.ContinentFR] = 1;
        }
      }
    });
    //Get all classe to fill in selects
    this.classeService.getClasses().subscribe(result => {
      this.selectClasse = result;
    });
    //Init Enregistrements
    this.Strategies = new Array<Strategy>();
    //Register to LangChangeEvent and write selected langage in variable Lang
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.Lang = event.lang;
    });
  }

  /** If user switch form, init both form and display the other form */
  switchForm() { 
    this.SearchWithTeam = !this.SearchWithTeam
    this.SearchForm.reset();
    this.SearchFormWithTeam.reset();
    this.SearchFormWithTeam.get('Boss').disable();
    this.SearchForm.get('Boss').disable();
    this.SearchForm.get('Zone').disable();
  }

  /** Update strategy table depending on Paginator */
  public getPagTable(data) {
    this.displayStrategies = data;
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  /** Launch the strategy research */
  onSubmit() {
    let User ="", BossZoneId="", C1="", C2="", C3="", C4="";
    //fill in User Id if route = mystrat to get only user's strategies
    if(this.currentRoute == 'mystrat') User = this.accessService.getSession("Info").Id.toString();
    //If the Form used is the one with a personal team
    if(this.SearchFormWithTeam.valid) {
      //Get BossZoneId 
      BossZoneId = this.SearchFormWithTeam.value.Boss;
      //Get Classes
      this.selectTeams.forEach(item => {
       if(item.Id == this.SearchFormWithTeam.value.Team) {
         C1 = item.CharactersConfiguration.Classe1.Id.toString();
         C2 = item.CharactersConfiguration.Classe2.Id.toString();
         C3 = item.CharactersConfiguration.Classe3.Id.toString();
         C4 = item.CharactersConfiguration.Classe4.Id.toString();
       }
     });
    }
    //If the form used is the custom one
    else if(this.SearchForm.value.Boss != "") {
      //Get BossZoneId
      BossZoneId = this.SearchForm.value.Boss;
      //Get the classes 
      C1 = this.SearchForm.value.Classe1 ?? "";
      C2 = this.SearchForm.value.Classe2 ?? "";
      C3 = this.SearchForm.value.Classe3 ?? "";
      C4 = this.SearchForm.value.Classe4 ?? "";
    }
    //Launch search via API (Display message if no Enregistrement found)
    this.stratService.getStrategiesByInfos(User, BossZoneId, C1, C2, C3, C4).subscribe(result => {
      this.Strategies = [];
      this.displayStrategies = [];
      this.Strategies = result;
      if(this.Strategies.length == 0) this.DisplayNoStrategyMessage = true;
    }, error => 
    {
      this.Strategies = [];
      this.displayStrategies = [];
      this.DisplayNoStrategyMessage = true;
    });                                            
  }

  /** Fill in options of Zone's select */
  public GetZones(Continent) {
    //init cascading selects + disables them
    this.selectZone = [];
    this.selectBoss = [];
    this.SearchForm.controls.Zone.setValue("");
    this.SearchForm.controls.Boss.setValue("");
    this.SearchForm.controls.Boss.disable();
    this.SearchForm.controls.Zone.disable();
    //Fill in selectZone with unique Zone values depending on Continent value
    var unique = [];
    for( let i = 0; i < this.AllBossZone.length; i++ ) {
      if( !unique[this.AllBossZone[i].Zone.ZoneFR] && this.AllBossZone[i].Zone.ContinentFR == Continent.value) {
        this.selectZone.push(this.AllBossZone[i]);
        unique[this.AllBossZone[i].Zone.ZoneFR] = 1;
      }
    }
    //If well filled in, enable select
    if(Continent.value != '') this.SearchForm.get('Zone').enable();
  }

  /** Fill in options of Boss's select in SearchForm */
  public GetBoss(Continent,Zone) {
    //init cascading selects + disables them
    this.selectBoss = [];
    this.SearchForm.controls.Boss.disable();
    this.SearchForm.controls.Boss.setValue("");
    //Feeling selectBoss with unique Boss values depending on Continent and Zone values
    var unique = [];
    for( let i = 0; i < this.AllBossZone.length; i++ ) {
      if( !unique[this.AllBossZone[i].Zone.ZoneFR] 
          && this.AllBossZone[i].Zone.ContinentFR == Continent.value
          && this.AllBossZone[i].Zone.ZoneFR == Zone.value ) {
        this.selectBoss.push(this.AllBossZone[i]);
        unique[this.AllBossZone[i].Boss.NameFR] = 1;
      }
    }
    //If well filled in, enable select
    if(Zone.value != '') this.SearchForm.controls.Boss.enable();
  }
  
  /** Fill in options of Boss's select in SearchFormWithTeam */
  GetBossViaTeam(TeamId) {
    //init cascading selects + disables them
    this.selectBoss = [];
    this.SearchFormWithTeam.controls.Boss.disable();
    this.SearchFormWithTeam.controls.Boss.setValue("");
    //Fill in select
    let ZoneId;
    if(TeamId.value != "") {
      //Get Zone Name corresponding to selected team
      let ZoneFR = this.selectTeams.find(team => team.Id == TeamId.value).Zone.ZoneFR;
      //Feeling selectBoss with unique Boss values depending on Zone Name
      let unique = [];
      for( let i = 0; i < this.AllBossZone.length; i++ ) {
        if( !unique[this.AllBossZone[i].Zone.ZoneFR] 
            && this.AllBossZone[i].Zone.ZoneFR == ZoneFR ) {
          this.selectBoss.push(this.AllBossZone[i]);
          unique[this.AllBossZone[i].Boss.NameFR] = 1;
        }
      }
      //If well filled in, enable select
      this.SearchFormWithTeam.get('Boss').enable();
    }
    else this.SearchFormWithTeam.get('Boss').disable();
  }
   //Displaying or Hiding help
   public ShowHelp(){
    this.Show = !this.Show;
  }

  /** Put a strategy in user's favorites */
  public putFavori(id)
  {
    let Fav = new FavoriteStrategy({});
    Fav.Strategy = new Strategy({Id:id});
    Fav.User = new User({Id:this.accessService.getSession("Info").Id})
    //Post favori then get all favori of the user (update local table and session)
    this.favService.postFavoriteStrategy(Fav).subscribe(() => { 
      this.favService.getFavoritestrategiesByUserId(this.accessService.getSession("Info").Id).subscribe(result =>{
        this.myFavs = result; 
        this.accessService.setSession("Fav",this.myFavs);
      });
    });  
  }

  /** Delete a strategy from user's favorites */
  public deleteFavori(id)
  {
    for (let elem of this.myFavs) { 
      if(elem.Strategy.Id == id) { 
        //If Favori found : delete in DB via API + update local table and session
        this.favService.deleteFavoriteStrategyById(elem.Id).subscribe(() => {});
        this.myFavs = this.myFavs.filter(r => r.Id != elem.Id);
        this.accessService.setSession("Fav",this.myFavs);
      }
    }
  }

  /** Allow to display different favorite icone depending on is favorite or not */
  public DisplayFavori(Id):boolean
  {
    let T = false;
    for(let elem of this.myFavs) { if( elem.Strategy && elem.Strategy.Id == Id) T = true; }
    return T;
  }

  /** Display Vote icone depending on differentes possibilities :
  If vote + : Display x et -
  If vote - : Display x et +
  If no vote : Display + et - */
  public DisplayVote(Id):number 
  {
    
    let T:number = 0;
    for(let elem of this.myVotes)
    {
      if(elem.Strategy && elem.Strategy.Id == Id)
      {
        if (elem.Vote == 1) T = 1;
        if (elem.Vote == -1) T = -1;
      }
    }
    return T;
  }

  /** Negative vote on a strategy */
  VoteMinus(Id)
  {
    //Init waiting variable
    let vote$ = new Subject<boolean>();
    //Fill in Vote infos
    let V:Vote = new Vote({
      Strategy : new Strategy({Id:Id}),
      User : new User({Id:this.accessService.getSession("Info").Id}),
      Vote : -1
    })
    //Search in all Votes
    for (let Vote of this.myVotes)
    {
       //If vote allready exist
      if (Vote.Strategy && Vote.Strategy.Id == Id)
      {
        //Delete current vote
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        //Update local strategy table
        this.Strategies[this.Strategies.findIndex(r => r.Id == Vote.Strategy.Id)].Note--;
      }
    }
    //Post new vote
    this.voteService.postVote(V).subscribe(() => { 
      vote$.next(true) });
    //Update local strategy table
    this.Strategies[this.Strategies.findIndex(r => r.Id == Id)].Note--;
    zip(vote$).subscribe(() => {
      //Get all user votes
      this.voteService.getVotesByUser(this.accessService.getSession("Info").Id).subscribe(result =>{
        //Update local and session vote table
        this.myVotes = result; 
        this.accessService.setSession("Votes",this.myVotes);
      })
    })
  }

  /** Positive vote on a strategy */
  VotePlus(Id)
  {
    //Init waiting variable
    let vote$ = new Subject<boolean>();
    //Fill in Vote infos
    let V:Vote = new Vote({    
      Strategy : new Strategy({Id:Id}),
      User : new User({Id:this.accessService.getSession("Info").Id}),
      Vote : 1
    });
    //Search in all Votes
    for (let Vote of this.myVotes)
    {
      //If vote allready exist
      if (Vote.Strategy && Vote.Strategy.Id == Id) 
      {
        //Delete current vote
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        //Update local strategy table
        this.Strategies[this.Strategies.findIndex(r => r.Id == Vote.Strategy.Id)].Note++;
      }
    }
    //Post new vote
    this.voteService.postVote(V).subscribe(() => { vote$.next(true) });
    //Update local strategy table
    this.Strategies[this.Strategies.findIndex(r => r.Id == Id)].Note++;
    zip(vote$).subscribe(() => {
      //Get all user votes
      this.voteService.getVotesByUser(this.accessService.getSession("Info").Id).subscribe(result =>{
        //Update local and session vote table
        this.myVotes = result;
        this.accessService.setSession("Votes",this.myVotes);
      });
    });
  }

  /** Delete vote on a strategy */
  DeleteVote(Id)
  {
    //Look for existing vote
    for (let Vote of this.myVotes)
    {
      //If a vote allreayd exist for this strategy
      if (Vote.Strategy && Vote.Strategy.Id == Id) 
      {
        //Delete actual vote
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        //update local and session vote table
        if (Vote.Vote == 1) this.Strategies[this.Strategies.findIndex(r => r.Id == Vote.Strategy.Id)].Note--;
        if (Vote.Vote == -1) this.Strategies[this.Strategies.findIndex(r => r.Id == Vote.Strategy.Id)].Note++;
        this.myVotes = this.myVotes.filter(r => r.Id != Vote.Id);
        this.accessService.setSession("Votes",this.myVotes);
      }
    }
  }
}
