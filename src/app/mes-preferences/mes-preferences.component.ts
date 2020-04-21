import { Component, OnInit, Inject } from '@angular/core';
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
import { Subject, zip } from 'rxjs';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

const Continent$ = new Subject<boolean>();
const Zone$ = new Subject<boolean>();

@Component({
  selector: 'app-mes-preferences',
  templateUrl: './mes-preferences.component.html',
  styleUrls: ['./mes-preferences.component.css']
})
export class MesPreferencesComponent implements OnInit {
  edit:boolean;
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
  teamId:number;
  MateamId:number;

  constructor(@Inject(SESSION_STORAGE) private session: WebStorageService,private routerService:Router,private classeService:ClasseDAL,private teamService:TeamDal,private bossZoneService:BosszoneDAL,private bossService:BossDAL,private zoneService:ZoneDAL, private mesteamsService:MesTeamsDAL) { }
  
  ngOnInit(): void {
    if(!this.session.get("TKA") || !this.session.get("TK"))
    {
      this.routerService.navigateByUrl("/")
    }
    this.teamId = 0;
    this.MateamId = 0;
    this.edit = false;
    this.errorUpload="";
    this.nomTeam="";
    this.messageNomTeam="";
    this.teamAdd = new MesTeams({});
    this.selectClasse = new Array<Classe>();
    this.selectContinent = new Array<Zone>();
    this.classeService.getClasses(this.session.get("TK")).subscribe(result =>{
      this.selectClasse = result;
    })
    this.zoneService.getZones(this.session.get("TK")).subscribe(response => {
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
    this.utilisateur = this.session.get("User");
    this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.session.get("TK")).subscribe(result =>{
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
      this.zoneService.getZones(this.session.get("TK")).subscribe(response => { 
        let i = 0;
        let j = response.length;
        response.forEach(item => {
          i++;
          if (item.ContinentFR == Continent.value) this.selectZone.push(item);
          if (item.ContinentFR == Continent && this.edit) 
          {
            this.selectZone.push(item);
            Continent$.next(true);
          }
        });
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
    this.bossZoneService.getBossZones(this.session.get("TK")).subscribe(response => {
      response.forEach(item => {
        if (item.Zone.Id == Z.value) this.teamAdd.Zone = new Zone({Id:item.Zone.Id});
        if (item.Zone.Id == Z && this.edit) 
        {
          this.teamAdd.Zone = new Zone({Id:item.Zone.Id});
          Zone$.next(true);
        }
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
  this.teamService.getTeamByClasses(this.Idclasse1,this.Idclasse2,this.Idclasse3,this.Idclasse4, this.session.get("TK")).subscribe(result => {
    this.teamAdd.Team = new Team({Id:result.Id});
    });
  }

  public upload()
  {
    this.teamAdd.Utilisateur = new Utilisateur({Id:this.session.get("User").Id});
    this.teamAdd.NomTeam = this.nomTeam;
    this.mesteamsService.postMaTeam(this.teamAdd, this.session.get("TK")).subscribe(result => {
      this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.session.get("TK")).subscribe(result =>{
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
    this.mesteamsService.deleteMaTeam(id, this.session.get("TK")).subscribe(result => {
      this.ngOnInit();
    });
  }

  public EditTeam(id)
  {
    this.messageClasse = "";
    this.edit = true;
    this.mesteamsService.getMaTeam(id, this.session.get("TK")).subscribe(result => {
      this.nomTeam = result.NomTeam;
      this.MateamId = result.Id;
      this.teamId = result.Team.Id;
      let C1Select = (document.getElementById("C1") as HTMLSelectElement);
      let C2Select = (document.getElementById("C2") as HTMLSelectElement);
      let C3Select = (document.getElementById("C3") as HTMLSelectElement);
      let C4Select = (document.getElementById("C4") as HTMLSelectElement);
      let myContinentSelect = (document.getElementById("T") as HTMLSelectElement);
      for(var i, j = 0; i = myContinentSelect.options[j]; j++) {
        if(i.value == result.Zone.ContinentFR) {
          myContinentSelect.selectedIndex = j;
            break;
        }
      }
      
      for(var i, j = 0; i = C1Select.options[j]; j++) {
        if(i.value == result.Team.Classe1.Id) {
          C1Select.selectedIndex = j;
          this.Idclasse1 = j;
            break;
        }
      }
      
      for(var i, j = 0; i = C2Select.options[j]; j++) {
        if(i.value == result.Team.Classe2.Id) {
          C2Select.selectedIndex = j;
          this.Idclasse2 = j;
            break;
        }
      }
      
      for(var i, j = 0; i = C3Select.options[j]; j++) {
        if(i.value == result.Team.Classe3.Id) {
          C3Select.selectedIndex = j;
          this.Idclasse3 = j;
            break;
        }
      }
     
      for(var i, j = 0; i = C4Select.options[j]; j++) {
        if(i.value == result.Team.Classe4.Id) {
          C4Select.selectedIndex = j;
          this.Idclasse4 = j;
            break;
        }
      }
      this.changeContinent(result.Zone.ContinentFR);
      this.changeZone(result.Zone.Id);
      
       zip(Continent$, Zone$).subscribe(() => {
        let myZoneSelect = (document.getElementById("Z") as HTMLSelectElement);
        for(var i, j = 0; i = myZoneSelect.options[j]; j++) {
          if(i.value == result.Zone.Id) {
            myZoneSelect.selectedIndex = j;
              break;
          }
        }
      });
    });
  }

  public update()
  {
    this.teamAdd.Utilisateur = new Utilisateur({Id:this.session.get("User").Id});
    this.teamAdd.NomTeam = this.nomTeam;
    if(!this.teamAdd.Team) this.teamAdd.Team = new Team({Id:this.teamId});
    this.mesteamsService.putMaTeam(this.teamAdd, this.MateamId, this.session.get("TK")).subscribe(() => {
      this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.session.get("TK")).subscribe(result =>{
        this.mesTeams = result;
      });
    }, error => {
      this.errorUpload = "Un problème est survenue, merci de réessayer."
    })
    this.ngOnInit();
  }
  
}
