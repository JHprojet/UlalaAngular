import { Component, OnInit } from '@angular/core';
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
import { zip, ReplaySubject } from 'rxjs';
import { AccessComponent } from '../helpeur/access-component';

const Continent$ = new ReplaySubject<boolean>();
const Zone$ = new ReplaySubject<boolean>();

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

  constructor(private accessService:AccessComponent,private classeService:ClasseDAL,private teamService:TeamDal,private bossZoneService:BosszoneDAL,private bossService:BossDAL,private zoneService:ZoneDAL, private mesteamsService:MesTeamsDAL) { }
  
  //Note globale importante : Solution à trouver pour éviter l'appelle du ngOnInit.
  //Bis repetita concernant les Idclasse qui devraient être un tableau. Modif API à prévoir sur le modèle de Classe. 

  //A tranformer via FormBuilder pour substantiellement siimplifier le component

  ngOnInit(): void {
    this.accessService.CheckAccess("User");
    this.teamId = 0;
    this.MateamId = 0;
    this.edit = false;
    this.errorUpload="";
    this.nomTeam="";
    this.messageNomTeam="";
    this.teamAdd = new MesTeams({});
    this.selectClasse = new Array<Classe>();
    this.selectContinent = new Array<Zone>();
    this.classeService.getClasses(this.accessService.data["User"]).subscribe(result =>{
      this.selectClasse = result;
    })
    this.zoneService.getZones(this.accessService.data["User"]).subscribe(response => {
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
    this.utilisateur = this.accessService.getSession("Info");
    this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.accessService.data["User"]).subscribe(result =>{
      this.mesTeams = result;
    },error =>{
      this.mesTeams = new Array<MesTeams>();
    })
  }

  //Voir SearchComponent : méthode similaire
  public changeContinent(Continent)
  {
    this.selectZone = [];
    this.selectBoss = [];
    this.IdBZ = "";
    if (Continent.value == 0) this.messageBossZone = "Veuillez sélectionner un Continent.";
    else {
      this.messageBossZone = "Veuillez sélectionner une Zone."
      this.zoneService.getZones(this.accessService.data["User"]).subscribe(response => { 
        response.forEach(item => {
          if (item.ContinentFR == Continent.value) this.selectZone.push(item);
          //Si en mode édition de la team, changement d'état du ReplaySubject pour remplissage en cascade.
          if (item.ContinentFR == Continent && this.edit) 
          {
            this.selectZone.push(item);
            Continent$.next(true);
          }
        });
      });
    }
  }

  //Fonctionnement idem méthode précédente
  public changeZone(Z)
  {
    this.selectBoss = [];
    this.IdBZ = "0";
    if (Z.value == 0) this.messageBossZone = "Veuillez sélectionner une Zone.";
    else {
    this.messageBossZone = "";
    this.bossZoneService.getBossZones(this.accessService.data["User"]).subscribe(response => {
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

  //Voir SearchComponent : méthodes similaires + remarque
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

  //Update de la team correspondante a chaque changement de classe si toutes les classes ont été sélectionnées
  public EcritureIdClasse()
  {
  this.teamService.getTeamByClasses(this.Idclasse1,this.Idclasse2,this.Idclasse3,this.Idclasse4, this.accessService.data["User"]).subscribe(result => {
    this.teamAdd.Team = new Team({Id:result.Id});
    });
  }

  //upload de la nouvelle team
  public upload()
  {
    this.teamAdd.Utilisateur = new Utilisateur({Id:this.accessService.data["Info"].Id});
    this.teamAdd.NomTeam = this.nomTeam;
    //Ajout de la team + récupération de la liste complète mise à jour
    this.mesteamsService.postMaTeam(this.teamAdd, this.accessService.data["User"]).subscribe(result => {
      this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.accessService.data["User"]).subscribe(result =>{
        this.mesTeams = result;
      })
    }, error => {
      this.errorUpload = "Un problème est survenue, merci de réessayer."
    })
    this.ngOnInit();
  }

  //Vérification du nom renseigné pour la team
  //Note : Je dois ajouter un check de nom existant déjà pour une team de cet utilisateur
  public CheckNomTeam()
  {
    if(this.nomTeam.length < 3) this.messageNomTeam = "Le nom de la team doit faire au moins 3 caractères."
    else this.messageNomTeam = "";
  }

  //Suppression d'une team.
  public DeleteTeam(id)
  {
    this.mesteamsService.deleteMaTeam(id, this.accessService.data["User"]).subscribe(result => {
      this.ngOnInit();
    });
  }

  //Remplissage automatique des champs avec les valeurs de la team à éditer.
  public EditTeam(id)
  {
    this.messageClasse = "";
    this.edit = true;
    //Récupération de la team
    this.mesteamsService.getMaTeam(id, this.accessService.data["User"]).subscribe(result => {
      this.nomTeam = result.NomTeam;
      this.MateamId = result.Id;
      this.teamId = result.Team.Id;
      let C1Select = (document.getElementById("C1") as HTMLSelectElement);
      let C2Select = (document.getElementById("C2") as HTMLSelectElement);
      let C3Select = (document.getElementById("C3") as HTMLSelectElement);
      let C4Select = (document.getElementById("C4") as HTMLSelectElement);
      let myContinentSelect = (document.getElementById("T") as HTMLSelectElement);
      
      //No comment, les quelques boucles suivantes sont à améliorer. Ca marche, même si c'est moche.
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
    //Envoi de la nouvelle team pour update via API puis récupération de la liste.
    this.teamAdd.Utilisateur = new Utilisateur({Id:this.accessService.data["Info"].Id});
    this.teamAdd.NomTeam = this.nomTeam;
    if(!this.teamAdd.Team) this.teamAdd.Team = new Team({Id:this.teamId});
    this.mesteamsService.putMaTeam(this.teamAdd, this.MateamId, this.accessService.data["User"]).subscribe(() => {
      this.mesteamsService.getMeTeamsByUserId(this.utilisateur.Id, this.accessService.data["User"]).subscribe(result =>{
        this.mesTeams = result;
      });
    }, error => {
      this.errorUpload = "Un problème est survenue, merci de réessayer."
    })
    this.ngOnInit();
  }
  
}
