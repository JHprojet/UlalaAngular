import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { AccessComponent } from '../helpeur/access-component';
import { zip, Subject } from 'rxjs';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/classe';
import { MesTeams } from '../models/mes-teams';
import { EnregistrementDAL } from '../service/enregistrement-dal';
import { Enregistrement } from '../models/enregistrement';
import { ActivatedRoute } from '@angular/router';
import { Vote } from '../models/vote';
import { Favori } from '../models/favori';
import { FavoriDAL } from '../service/favori-dal';
import { VoteDAL } from '../service/vote-dal';
import { Utilisateur } from '../models/utilisateur';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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

  constructor(private translate:TranslateService, private cd:ChangeDetectorRef, private voteService:VoteDAL,private favService:FavoriDAL,private v:CustomValidators,private activatedRoute:ActivatedRoute,private enregistrementService:EnregistrementDAL,private classeService:ClasseDAL,private bossZoneService:BosszoneDAL,private accessService:AccessComponent,private utilisateurService:UtilisateurDAL, private fb:FormBuilder, private cv:CustomValidators) { }
  //Variable containing all BossZone
  AllBossZone:BossZone[] = new Array<BossZone>();
  //Variable for the display of enregistrement depending on paginatorComponent
  displayEnregistrements:Enregistrement[] = new Array<Enregistrement>();
  //Variable to fill in selects
  selectContinent:BossZone[] = new Array<BossZone>();
  selectZone:BossZone[] = new Array<BossZone>();
  selectBoss:BossZone[] = new Array<BossZone>();
  selectClasse:Classe[] = new Array<Classe>();
  selectMyTeams:MesTeams[] = new Array<MesTeams>();
  //is the user connected
  accessUser:boolean = false;
  //Displaying help
  Show:boolean = false;
  //Variable displaying the choosen Form
  SearchWithTeam:boolean = false;
  //current Route
  currentRoute:string;
  //Variable displaying if no enregistrement found
  DisplayNoEnregistrementMessage:boolean = false;
  //Variable with all votes and favori of the user
  myVotes:Vote[];
  myFavs:Favori[];
  //Language
  Lang:string;
  //Getter and Setter for strategies (The getter allow to filter strategy depending on route)
  private _enregistrement: Enregistrement[];
  get Enregistrements():Enregistrement[] {
    
    if (this.currentRoute == "favstrat")
    {
      let newTab:Enregistrement[] = new Array<Enregistrement>();
      for (let elem of this._enregistrement)
      {
        for (let fav of this.myFavs) 
        {
          if (elem.Id == fav.Enregistrement.Id) newTab.push(elem);
        }
      }
      return newTab;
    }
    else return this._enregistrement;
  };
  set Enregistrements(P:Enregistrement[]) {
    this._enregistrement = P;
  }
  
  ngOnInit(): void {
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
      if(this.accessService.getSession("Teams")) this.selectMyTeams = this.accessService.getSession("Teams");
      else this.selectMyTeams = new Array<MesTeams>();
      if(this.accessService.getSession("Fav"))  this.myFavs = this.accessService.getSession("Fav");
      else  this.myFavs = new Array<Favori>();
      if(this.accessService.getSession("Votes")) this.myVotes = this.accessService.getSession("Votes");
      else this.myVotes = new Array<Vote>();
    }
    //Get all BossZone list
    this.bossZoneService.getBossZones().subscribe(result => {
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
    this.Enregistrements = new Array<Enregistrement>();
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
    this.displayEnregistrements = data;
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
      this.selectMyTeams.forEach(item => {
       if(item.Id == this.SearchFormWithTeam.value.Team) {
         C1 = item.Team.Classe1.Id.toString();
         C2 = item.Team.Classe2.Id.toString();
         C3 = item.Team.Classe3.Id.toString();
         C4 = item.Team.Classe4.Id.toString();
       }
     });
    }
    //If the form used is the custom one
    else if(this.SearchForm.value.Boss != "") {
      //Get BossZoneId
      BossZoneId = this.SearchForm.value.Boss;
      //Get the classes 
      C1 = this.SearchForm.value.Classe1;
      C2 = this.SearchForm.value.Classe2;
      C3 = this.SearchForm.value.Classe3;
      C4 = this.SearchForm.value.Classe4;
    }
    //Launch search via API (Display message if no Enregistrement found)
    this.enregistrementService.getStrategiesByInfos(User, BossZoneId, C1, C2, C3, C4).subscribe(result => {
      this.Enregistrements = [];
      this.displayEnregistrements = [];
      this.Enregistrements = result;
      if(this.Enregistrements.length == 0) this.DisplayNoEnregistrementMessage = true;
    }, error => 
    {
      this.Enregistrements = [];
      this.displayEnregistrements = [];
      this.DisplayNoEnregistrementMessage = true;
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
        unique[this.AllBossZone[i].Boss.NomFR] = 1;
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
      let ZoneFR = this.selectMyTeams.find(team => team.Id == TeamId.value).Zone.ZoneFR;
      //Feeling selectBoss with unique Boss values depending on Zone Name
      let unique = [];
      for( let i = 0; i < this.AllBossZone.length; i++ ) {
        if( !unique[this.AllBossZone[i].Zone.ZoneFR] 
            && this.AllBossZone[i].Zone.ZoneFR == ZoneFR ) {
          this.selectBoss.push(this.AllBossZone[i]);
          unique[this.AllBossZone[i].Boss.NomFR] = 1;
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
    let Fav = new Favori({});
    Fav.Enregistrement = new Enregistrement({Id:id});
    Fav.Utilisateur = new Utilisateur({Id:this.accessService.getSession("Info").Id})
    //Post favori then get all favori of the user (update local table and session)
    this.favService.postFavorite(Fav).subscribe(() => { 
      this.favService.getFavoritesByUserId(this.accessService.getSession("Info").Id).subscribe(result =>{
        this.myFavs = result; 
        this.accessService.setSession("Fav",this.myFavs);
      });
    });  
  }

  /** Delete a strategy from user's favorites */
  public deleteFavori(id)
  {
    for (let elem of this.myFavs) { 
      if(elem.Enregistrement.Id == id) { 
        //If Favori found : delete in DB via API + update local table and session
        this.favService.deleteFavoriteById(elem.Id).subscribe(() => {});
        this.myFavs = this.myFavs.filter(r => r.Id != elem.Id);
        this.accessService.setSession("Fav",this.myFavs);
      }
    }
  }

  /** Allow to display different favorite icone depending on is favorite or not */
  public DisplayFavori(Id):boolean
  {
    let T = false;
    for(let elem of this.myFavs) { if(elem.Enregistrement.Id == Id) T = true; }
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
      if(elem.Enregistrement && elem.Enregistrement.Id == Id)
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
      Enregistrement : new Enregistrement({Id:Id}),
      Utilisateur : new Utilisateur({Id:this.accessService.getSession("Info").Id})
    })
    //Search in all Votes
    for (let Vote of this.myVotes)
    {
       //If vote allready exist
      if (Vote.Enregistrement && Vote.Enregistrement.Id == Id)
      {
        //Delete current vote
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        //Update local strategy table
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
      }
    }
    //Post new vote
    this.voteService.postVote(V).subscribe(() => { vote$.next(true) });
    //Update local strategy table
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note--;
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
      Enregistrement : new Enregistrement({Id:Id}),
      Utilisateur : new Utilisateur({Id:this.accessService.getSession("Info").Id})
    });
    //Search in all Votes
    for (let Vote of this.myVotes)
    {
      //If vote allready exist
      if (Vote.Enregistrement && Vote.Enregistrement.Id == Id) 
      {
        //Delete current vote
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        //Update local strategy table
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
      }
    }
    //Post new vote
    this.voteService.postVote(V).subscribe(() => { vote$.next(true) });
    //Update local strategy table
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note++;
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
      if (Vote.Enregistrement && Vote.Enregistrement.Id == Id) 
      {
        //Delete actual vote
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        //update local and session vote table
        if (Vote.Vote == 1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
        if (Vote.Vote == -1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
        this.myVotes = this.myVotes.filter(r => r.Id != Vote.Id);
        this.accessService.setSession("Votes",this.myVotes);
      }
    }
  }
}
