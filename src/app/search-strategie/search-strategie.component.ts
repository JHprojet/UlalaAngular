import { Component, OnInit } from '@angular/core';
import { Zone } from '../models/zone';
import { Boss } from '../models/boss';
import { Classe } from '../models/classe';
import { ClasseDAL } from '../service/classe-dal'
import { ZoneDAL } from '../service/zone-dal';
import { BossDAL } from '../service/boss-dal';
import { BosszoneDAL } from '../service/bosszone-dal';
import { EnregistrementDAL } from '../service/enregistrement-dal';
import { Enregistrement } from '../models/enregistrement';
import { AppComponent } from '../app.component';
import { Utilisateur } from '../models/utilisateur';
import { MesTeams } from '../models/mes-teams';
import { MesTeamsDAL } from '../service/mesteams-dal';
import { Favori } from '../models/favori';
import { FavoriDAL } from '../service/favori-dal';
import { Vote } from '../models/vote';
import { VoteDAL } from '../service/vote-dal';
import { zip, Subject } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';

const fav$ = new Subject<boolean>();
const vote$ = new Subject<boolean>();

@Component({
  selector: 'app-search-strategie',
  templateUrl: './search-strategie.component.html',
  styleUrls: ['./search-strategie.component.css']
})
export class SearchStrategieComponent implements OnInit {

  constructor(private routerService:Router,private activatedRoute:ActivatedRoute,private voteService:VoteDAL,private favorisService:FavoriDAL,private mesTeamsService:MesTeamsDAL,private appService:AppComponent,private classeService:ClasseDAL, private zoneService:ZoneDAL, private enregistrementService:EnregistrementDAL, private bossZoneService:BosszoneDAL,  private bossService:BossDAL) { }

  selectContinent: Zone[];
  selectZone: Zone[];
  selectBoss: Boss[];
  selectClasse: Classe[];
  selectMesTeams: MesTeams[];
  zoneId: number;
  Idclasse1: string;
  Idclasse2: string;
  Idclasse3: string;
  Idclasse4: string;
  IdBZ: string;
  U:string;
  messageIndication:string;
  currentUser:Utilisateur;
  MaTeam:MesTeams;
  myFavs:Favori[];
  myVotes:Vote[];
  Show:boolean;
  TexteButtonHelp:string;
  route: string;
  private _enregistrement: Enregistrement[];

  get Enregistrements():Enregistrement[] {
    if (this.route == "favstrat")
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
    if(!this.appService.data ["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
    
    this.Enregistrements = new Array<Enregistrement>();
    this.activatedRoute.url.subscribe(params => {
      this.route = params[0].path;
    })
    this.TexteButtonHelp = "Afficher l'aide";
    this.Show = false;
    this.myFavs = new Array<Favori>();
    this.myVotes = new Array<Vote>();
    this.selectContinent = new Array<Zone>();
    this.selectZone = new Array<Zone>();
    this.selectBoss = new Array<Boss>();
    this.selectClasse = new Array<Classe>();
    this.selectMesTeams = new Array<MesTeams>();
    this.zoneId = 0;
    this.Idclasse1 = "";
    this.Idclasse2 = "";
    this.Idclasse3 = "";
    this.Idclasse4 = "";
    this.IdBZ= "";
    this.U="";
    this.Enregistrements= new Array<Enregistrement>();
    this.messageIndication="";
    this.currentUser;
    this.MaTeam = new MesTeams({Id:0});
    this.currentUser = new Utilisateur({});
    if(this.appService.data["User"]) 
    {
      this.currentUser = this.appService.data["User"];
      if (this.route == 'mystrat') this.U = this.currentUser.Id.toString();
    }
    else this.currentUser.Id = 0;
    
    if (this.currentUser.Id != 0)
    {
      this.mesTeamsService.getMeTeamsByUserId(this.currentUser.Id, this.appService.data['TK']).subscribe(result => {
        this.selectMesTeams = result;
      })
      this.favorisService.getFavorisByUtilisateurId(this.currentUser.Id, this.appService.data['TK']).subscribe(result => {
        this.myFavs = result;
      }, error =>
      {
        this.myFavs = new Array<Favori>();
      })
      this.voteService.getVotesByUser(this.currentUser.Id, this.appService.data['TK']).subscribe(result => {
        this.myVotes = result;
      }, error =>
      {
        this.myVotes = new Array<Vote>();
      })
    }
    this.classeService.getClasses(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
      this.selectClasse = response;
    });
    this.zoneService.getZones(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
    response.forEach(item => {
      if (this.selectContinent.findIndex(sc => sc.ContinentFR == item.ContinentFR) == -1) {
        this.selectContinent.push(item);
        }
      });
    });
  }

  public choixMaTeam(Team)
  {
    if (Team.value == 0)
    {
      this.MaTeam = new MesTeams({});
      this.ngOnInit();
    }
    else{
    this.mesTeamsService.getMaTeam(Team.value, this.appService.data['TK']).subscribe(result => {
      this.MaTeam = result;
    })
    this.bossZoneService.getBossZones(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
      this.selectBoss = [];
      this.IdBZ = "0";
      this.messageIndication = "Veuillez sélectionner un Boss."
      response.forEach(item => {
        if (item.Zone.Id == this.MaTeam.Zone.Id) {
          this.zoneId = item.Zone.Id;
          this.bossService.getBoss(item.Boss.Id, this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
            this.selectBoss.push(response);
            })
          }
        })
      });
    }
  }

  public changeContinent(Continent)
  {
    this.selectZone = [];
    this.selectBoss = [];
    this.IdBZ = "-1";
    if (Continent.value == 0) 
    {
      this.messageIndication = "";
      this.IdBZ = "";
    }
    else {
    this.messageIndication = "Veuillez sélectionner une Zone."
    this.zoneService.getZones(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {     
      response.forEach(item => {
        if (item.ContinentFR == Continent.value) {
          this.selectZone.push(item);
          }
        })
      });
    }
  }
  public changeZone(Zone)
  {
    this.selectBoss = [];
    this.IdBZ = "0";
    if (Zone.value == 0) 
    {
    this.messageIndication = "Veuillez sélectionner une Zone.";
    this.IdBZ = "-1";
    }
    else {
    this.bossZoneService.getBossZones(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
      this.messageIndication = "Veuillez sélectionner un Boss."
      response.forEach(item => {
        if (item.Zone.Id == Zone.value) {
          this.zoneId = item.Zone.Id;
          this.bossService.getBoss(item.Boss.Id, this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
            this.selectBoss.push(response);
            })
          }
        })
      });
    }
  }

  public changeBoss(Boss)
  {
    this.IdBZ = "0";
    if (Boss.value == 0) this.messageIndication = "Veuillez sélectionner un Boss.";
    else {
      this.messageIndication = "";
      this.bossZoneService.getBossZones(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(response => {
        response.forEach(item => {
          if (Boss.value == item.Boss.Id && this.zoneId == item.Zone.Id) 
          {
            this.IdBZ = item.Id.toString();
          }
        });
      });
    }
  }
  
  public changeClasse1(classe)
  {
    if(classe.value != 0) this.Idclasse1 = classe.value.toString();
    else this.Idclasse1 = "";
  }

  public changeClasse2(classe)
  {
    if(classe.value != 0) this.Idclasse2 = classe.value.toString();
    else this.Idclasse2 = "";
  }

  public changeClasse3(classe)
  {
    if(classe.value != 0) this.Idclasse3 = classe.value.toString();
    else this.Idclasse3 = "";
  }

  public changeClasse4(classe)
  {
    if(classe.value != 0) this.Idclasse4 = classe.value.toString();
    else this.Idclasse4 = "";
  }

  public chercherEnregistrements()
  {
    this.Enregistrements = [];
    if (this.IdBZ == '0') this.messageIndication = "Veuillez sélectionner un Boss.";
    else if (this.IdBZ == '-1') this.messageIndication = "Veuillez sélectionner une Zone.";
    else
    {
      if (this.MaTeam.Id != 0)
      {
        this.Idclasse1 = this.MaTeam.Team.Classe1.Id.toString();
        this.Idclasse2 = this.MaTeam.Team.Classe2.Id.toString();
        this.Idclasse3 = this.MaTeam.Team.Classe3.Id.toString();
        this.Idclasse4 = this.MaTeam.Team.Classe4.Id.toString();
      }
      this.enregistrementService.getEnregistrementsByInfos(this.U, this.IdBZ, this.Idclasse1, this.Idclasse2, this.Idclasse3, this.Idclasse4, this.appService.data["TK"]?? this.appService.data["TKA"])
      .subscribe(result => {
      this.Enregistrements = result;
      }, error => {
        this.messageIndication = "Oops, aucun enregistrement n'a été trouvé. Essayez peut-être avec moins de filtres!";
      })
    }
  }

  public mettreFavori(id)
  {
    let Fav = new Favori({});
    Fav.Enregistrement = new Enregistrement({Id:id});
    Fav.Utilisateur = new Utilisateur({Id:this.currentUser.Id})
    this.favorisService.postFavori(Fav, this.appService.data['TK']).subscribe(() => { fav$.next(true) });
    zip(fav$).subscribe(() => {
      this.favorisService.getFavorisByUtilisateurId(this.currentUser.Id, this.appService.data['TK']).subscribe(result =>{
        this.myFavs = result;
      });
    });    
  }

  public retraitFavori(id)
  {
    for (let elem of this.myFavs)
    {
      if(elem.Enregistrement.Id == id) 
      {
        this.favorisService.deleteFavori(elem.Id, this.appService.data['TK']).subscribe(() => {});
        this.myFavs = this.myFavs.filter(r => r.Id != elem.Id);
      }
    }
  }

  public VerifFavori(Id):boolean
  {
    let T = false;
    for(let elem of this.myFavs)
    {
      if(elem.Enregistrement.Id == Id) T = true;
    }
    return T;
  }

  public VerifVote(Id):number
  {
    let T:number = 0;
    let test:boolean;
    for(let elem of this.myVotes)
    {
      if(elem.Enregistrement.Id == Id)
      {
        if (elem.Vote == 1) T = 1;
        if (elem.Vote == -1) T = -1;
      }
    }
    return T;
  }

  VoteMoins(Id)
  {
    let V:Vote = new Vote({})
    V.Enregistrement = new Enregistrement({Id:Id})
    V.Utilisateur = new Utilisateur({Id:this.currentUser.Id})
    V.Vote = -1;
    for (let Vote of this.myVotes)
    {
      if (Vote.Enregistrement.Id == Id) 
      {
        this.voteService.deleteVote(Vote.Id, this.appService.data['TK']).subscribe(() => {});
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
      }
    }
    this.voteService.postVote(V, this.appService.data['TK']).subscribe(() => { vote$.next(true) });
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note--;
    zip(vote$).subscribe(() => {
      this.voteService.getVotesByUser(this.currentUser.Id, this.appService.data['TK']).subscribe(result =>{
        this.myVotes = result;
      })
    })
  }


  VotePlus(Id)
  {
    let V:Vote = new Vote({})
    V.Enregistrement = new Enregistrement({Id:Id})
    V.Utilisateur = new Utilisateur({Id:this.currentUser.Id})
    V.Vote = 1;
    for (let Vote of this.myVotes)
    {
      if (Vote.Enregistrement.Id == Id) 
      {
        this.voteService.deleteVote(Vote.Id, this.appService.data['TK']).subscribe(() => {});
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
      }
    }
    this.voteService.postVote(V, this.appService.data['TK']).subscribe(() => { vote$.next(true) });
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note++;
    zip(vote$).subscribe(() => {
      this.voteService.getVotesByUser(this.currentUser.Id, this.appService.data['TK']).subscribe(result =>{
        this.myVotes = result;
      });
    });
  }

  DeleteVote(Id)
  {
    for (let Vote of this.myVotes)
    {
      if (Vote.Enregistrement.Id == Id) 
      {
        this.voteService.deleteVote(Vote.Id, this.appService.data['TK']).subscribe(() => {});
        if (Vote.Vote == 1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
        if (Vote.Vote == -1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
        this.myVotes = this.myVotes.filter(r => r.Id != Vote.Id);
      }
    }
  }

  public ShowHelp(){
    this.Show = !this.Show;
    if (this.TexteButtonHelp == "Afficher l'aide") this.TexteButtonHelp = "Cacher l'aide";
    else if (this.TexteButtonHelp == "Cacher l'aide") this.TexteButtonHelp = "Afficher l'aide";
  }
}
