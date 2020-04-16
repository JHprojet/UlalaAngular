import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Utilisateur } from '../models/utilisateur';
import { MesTeams } from '../models/mes-teams';
import { MesTeamsDAL } from '../service/mesteams-dal';
import { Boss } from '../models/boss';
import { Zone } from '../models/zone';
import { Classe } from '../models/Classe';
import { ZoneDAL } from '../service/zone-dal';
import { BossDAL } from '../service/boss-dal';
import { BosszoneDAL } from '../service/bosszone-dal';
import { TeamDal } from '../service/team-dal';
import { ClasseDAL } from '../service/classe-dal';
import { Team } from '../models/team';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mes-preferences',
  templateUrl: './mes-preferences.component.html',
  styleUrls: ['./mes-preferences.component.css']
})
export class MesPreferencesComponent implements OnInit {
  utilisateur:Utilisateur;
  teamAdd:MesTeams;
  mesTeams:MesTeams[];
  selectClasse: Classe[];
  selectContinent: Zone[];
  selectZone: Zone[];
  selectBoss: Boss[];
  Idclasse1: number;
  Idclasse2: number;
  Idclasse3: number;
  Idclasse4: number;
  messageClasse: string;
  IdBZ: string;
  messageBossZone:string;
  zoneId: number = 0;
  nomTeam:string;
  messageNomTeam:string;
  errorUpload:string;
  
  constructor(private routerService:Router,private classeService:ClasseDAL,private teamService:TeamDal,private bossZoneService:BosszoneDAL,private bossService:BossDAL,private zoneService:ZoneDAL,private appService:AppComponent, private mesteamsService:MesTeamsDAL) { }
  
  ngOnInit(): void {
    if(!this.appService.data["TKA"])
    {
      this.routerService.navigateByUrl("/")
    }
    this.errorUpload="";
    this.nomTeam="";
    this.messageNomTeam="";
    this.teamAdd = new MesTeams({});
    this.selectClasse = new Array<Classe>();
    this.selectContinent = new Array<Zone>();
    this.classeService.getClasses(this.appService.data["TK"]??this.appService.data["TKA"]).subscribe(result =>{
      this.selectClasse = result;
    })
    this.zoneService.getZones(this.appService.data["TK"]).subscribe(response => {
      response.forEach(item => {
        if (this.selectContinent.findIndex(sc => sc.ContinentFR == item.ContinentFR) == -1) {
          this.selectContinent.push(item);
          }
        });
      });
    this.Idclasse1 = 0;
    this.Idclasse2 = 0; 
    this.Idclasse3 = 0; 
    this.Idclasse4 = 0;
    this.selectZone = new Array<Zone>();
    this.selectBoss = new Array<Boss>();
    this.messageClasse = "Veuillez sélectionner les 4 classes.";
    this.IdBZ = "0";
    this.messageBossZone = "Veuillez sélectionner un Continent.";
    this.zoneId = 0;
    this.utilisateur = new Utilisateur({})
    this.appService.getFromSession["User"];
    this.utilisateur = this.appService.data["User"];
    this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.appService.data['TK']).subscribe(result =>{
      this.mesTeams = result;
    
    },error =>{
      this.mesTeams = new Array<MesTeams>();
    })
  }

  public changeContinent(Continent)
  {
    this.selectZone = [];
    this.selectBoss = [];
    this.IdBZ = "";
    if (Continent.value == 0) this.messageBossZone = "Veuillez sélectionner un Continent.";
    else {
    this.messageBossZone = "Veuillez sélectionner une Zone."
    this.zoneService.getZones(this.appService.data["TK"]).subscribe(response => {     
      response.forEach(item => {
        if (item.ContinentFR == Continent.value) {
          this.selectZone.push(item);
          }
        })
      });
    }
  }

  public changeZone(Z)
  {
    this.selectBoss = [];
    this.IdBZ = "0";
    if (Z.value == 0) this.messageBossZone = "Veuillez sélectionner une Zone.";
    else {
    this.messageBossZone = "";
    this.bossZoneService.getBossZones(this.appService.data["TK"]).subscribe(response => {
      response.forEach(item => {
        if (item.Zone.Id == Z.value) 
          this.teamAdd.Zone = new Zone({Id:item.Zone.Id});
        });
      });
    }
  }

  public changeClasse1(classe)
  {
    this.messageClasse = "";
    this.Idclasse1 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else{
      this.EcritureIdClasse()
    }
  }

  public changeClasse2(classe)
  {
    this.messageClasse = "";
    this.Idclasse2 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else{
      this.EcritureIdClasse()
    }
  }

  public changeClasse3(classe)
  {
    this.messageClasse = "";
    this.Idclasse3 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else {
      this.EcritureIdClasse()
    }
  }

  public changeClasse4(classe)
  {
    this.messageClasse = "";
    this.Idclasse4 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else {
      this.EcritureIdClasse()
    }
  }

  public EcritureIdClasse()
  {
  this.teamService.getTeamByClasses(this.Idclasse1,this.Idclasse2,this.Idclasse3,this.Idclasse4, this.appService.data["TK"]).subscribe(result => {
    this.teamAdd.Team = new Team({Id:result.Id});
    });
  }

  public upload()
  {
    this.teamAdd.Utilisateur = new Utilisateur({Id:this.appService.data["User"].Id});
    this.teamAdd.NomTeam = this.nomTeam;
    this.mesteamsService.postMaTeam(this.teamAdd, this.appService.data['TK']).subscribe(result => {
      this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.appService.data['TK']).subscribe(result =>{
        this.mesTeams = result;
      })
    }, error => {
      this.errorUpload = "Un problème est survenue, merci de réessayer."
    })
    this.ngOnInit();
  }

  public CheckNomTeam()
  {
    if(this.nomTeam.length < 3) this.messageNomTeam = "Le nom de la team doit faire au moins 3 caractères."
    else this.messageNomTeam = "";
  }

  public DeleteTeam(id)
  {
    this.mesteamsService.deleteMaTeam(id, this.appService.data['TK']).subscribe(result => {
      this.ngOnInit();
    });
  }
}
