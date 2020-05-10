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
import { Utilisateur } from '../models/utilisateur';
import { MesTeams } from '../models/mes-teams';
import { MesTeamsDAL } from '../service/mesteams-dal';
import { Favori } from '../models/favori';
import { FavoriDAL } from '../service/favori-dal';
import { Vote } from '../models/vote';
import { VoteDAL } from '../service/vote-dal';
import { zip, Subject, ReplaySubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FollowDAL } from '../service/follow-dal';
import { Follow } from '../models/follow';
import { AccessComponent } from '../helpeur/access-component';

const fav$ = new ReplaySubject<boolean>();
const vote$ = new ReplaySubject<boolean>();

@Component({
  selector: 'app-search-strategie',
  templateUrl: './search-strategie.component.html',
  styleUrls: ['./search-strategie.component.css']
})
export class SearchStrategieComponent implements OnInit {

  constructor(private accessService:AccessComponent,private followService:FollowDAL,private activatedRoute:ActivatedRoute,private voteService:VoteDAL,private favorisService:FavoriDAL,private mesTeamsService:MesTeamsDAL,private classeService:ClasseDAL, private zoneService:ZoneDAL, private enregistrementService:EnregistrementDAL, private bossZoneService:BosszoneDAL,  private bossService:BossDAL) { }

  // /!\ Component en cours de refonte total. En cours de test sur test.component /!\


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
  accessUser: boolean;

  //Getter et Setter pour les stratégies (Le getter permet de retourner les stratégies en favori si sur la route "favstrat" sinon, renvoi tous les élements)
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
    this.accessService.getAnonymeKey();
    this.accessUser = false;
    this.currentUser = new Utilisateur({});
    this.Enregistrements = new Array<Enregistrement>();
    if(this.accessService.data["Info"]) 
    {
      this.currentUser = this.accessService.data["Info"];
      this.accessUser = true;
      if (this.route == 'mystrat') this.U = this.currentUser.Id.toString();
    }
    else this.currentUser.Id = 0;
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
    zip(this.accessService.CheckAno$).subscribe(() => {
      this.activatedRoute.url.subscribe(params => {
        this.route = params[0].path;
      })
      if (this.currentUser.Id != 0) {
        this.mesTeamsService.getMeTeamsByUserId(this.currentUser.Id, this.accessService.data["User"]).subscribe(result => {
          this.selectMesTeams = result;
        });
        this.favorisService.getFavorisByUtilisateurId(this.currentUser.Id, this.accessService.data["User"]).subscribe(result => {
          this.myFavs = result;
        }, error => {
          this.myFavs = new Array<Favori>();
        });
        this.voteService.getVotesByUser(this.currentUser.Id, this.accessService.data["User"]).subscribe(result => {
          this.myVotes = result;
        }, error =>
        {
          this.myVotes = new Array<Vote>();
        });
      }
      this.classeService.getClasses(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
        this.selectClasse = response;
      });
      this.zoneService.getZones(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
        response.forEach(item => {
          if (this.selectContinent.findIndex(sc => sc.ContinentFR == item.ContinentFR) == -1) {
            this.selectContinent.push(item);
          }
        });
      });
    });
  }

  //Après sélection d'une team perso (connecté uniquement)
  public choixMaTeam(Team)
  { //Si pas de team sélectionné (option vide)
    if (Team.value == 0) {
      this.MaTeam = new MesTeams({});
      this.ngOnInit();
    }
    //Si une team est sélectionnée
    else {
    this.mesTeamsService.getMaTeam(Team.value, this.accessService.data["User"]).subscribe(result => {
      this.MaTeam = result; //Récupération de la team sélectionnée via API
    });
    this.bossZoneService.getBossZones(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
      this.selectBoss = [];
      this.IdBZ = "0";
      this.messageIndication = "Veuillez sélectionner un Boss."
      response.forEach(item => {
        if (item.Zone.Id == this.MaTeam.Zone.Id) {
          this.zoneId = item.Zone.Id;
          this.bossService.getBoss(item.Boss.Id, this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
            this.selectBoss.push(response); //Récupération de la liste des boss présent dans la team sélectionnée 
            })
          }
        })
      });
    }
  }

  //Non fonctionnel ATM
  public Follow(Id:Number)
  {
    if(this.accessService.data["Info"].Id != Id) 
    {
      let follow:Follow = new Follow({Id:0,Follower:new Utilisateur({Id:this.accessService.data["Info"].Id}), Followed:new Utilisateur({Id:Id})})

      this.followService.postFollow(follow, this.accessService.data["User"]).subscribe(result => {
        console.log("ok")
      });
    }
  }

  //Non fonctionnel ATM
  public Unfollow(Id:number)
  {
    this.followService.getFollowbyFollowedFollower(this.accessService.data["Info"].Id, Id, this.accessService.data["User"]).subscribe(result => {
        this.followService.deleteFollow(result, this.accessService.data["User"]).subscribe(result2 => {
          console.log("DELETE OK");
        })
      })
  }

  //Méthode permettant de récupérer la liste des Zones présentes dans le continent sélectionné pour remplir la prochaine liste déroulante
  public changeContinent(Continent)
  {
    //Remise à zéro des listes déroulantes en cascade.
    this.selectZone = [];
    this.selectBoss = [];
    this.IdBZ = "-1"; //L'indice IdBZ en fonction de sa valeur permet le changement du message d'erreur (s'il manque des infos) à la validation
    if (Continent.value == 0) // Si continent remis à valeur vide.
    {
      this.messageIndication = "";
      this.IdBZ = "";
    }
    else { //Si un continent a été sélectionné
    this.messageIndication = "Veuillez sélectionner une Zone."
    this.zoneService.getZones(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {     
      response.forEach(item => {
        if (item.ContinentFR == Continent.value) {
          this.selectZone.push(item); //Remplissage du prochain menu déroulant en fonction de la sélection.
          }
        })
      });
    }
  }

  //Méthode permettant de récupérer la liste des Boss présents dans la Zone sélectionnée pour remplir la prochaine liste déroulante
  //Même fonctionnement en gros que méthode précédente.
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
      this.bossZoneService.getBossZones(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
        this.messageIndication = "Veuillez sélectionner un Boss."
        response.forEach(item => {
          if (item.Zone.Id == Zone.value) {
            this.zoneId = item.Zone.Id;
            this.bossService.getBoss(item.Boss.Id, this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
              this.selectBoss.push(response);
            });
          }
        });
      });
    }
  }

  //Méthode permettant d'enregistrer les infos sur Continent + Zone + Boss afin de les garder en mémoire pour réutilisation
  public changeBoss(Boss)
  {
    this.IdBZ = "0";
    if (Boss.value == 0) this.messageIndication = "Veuillez sélectionner un Boss.";
    else {
      this.messageIndication = "";
      this.bossZoneService.getBossZones(this.accessService.data["User"]??this.accessService.data["Anonyme"]).subscribe(response => {
        response.forEach(item => {
          if (Boss.value == item.Boss.Id && this.zoneId == item.Zone.Id) 
          {
            this.IdBZ = item.Id.toString(); //String afin de pouvoir garder une valeur texte vide et pas null ou 0 pour envoi vers API.
          }
        });
      });
    }
  }
  
  //4 fois la même méthode pour enregistrer la valeur de la classe sélectionné sur menu déroulant.
  //Note pour plus tard, il faudra penser à changer ma manière de procéder sur API sur mon modèle afin d'avoir un tableau de classe plutôt que 4 classes séparés
  //afin d'avoir une méthode au lieu de 4.
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

  //Une fois la validation faite par l'utilisateur, affichage des messages d'erreur si des données sont manquantes puis
  //Lancement de la requête avec tous les éléments pour récupérer uniquement les enregistrements correspondants.
  public chercherEnregistrements()
  {
    this.Enregistrements = []; //Vider la liste des enregistrements
    //Display message erreur si données manquantes sinon process.
    if (this.IdBZ == '0') this.messageIndication = "Veuillez sélectionner un Boss.";
    else if (this.IdBZ == '-1') this.messageIndication = "Veuillez sélectionner une Zone.";
    else
    { //Si une team perso a pas été sélectionnée report des informations
      if (this.MaTeam.Id != 0) {
        this.Idclasse1 = this.MaTeam.Team.Classe1.Id.toString();
        this.Idclasse2 = this.MaTeam.Team.Classe2.Id.toString();
        this.Idclasse3 = this.MaTeam.Team.Classe3.Id.toString();
        this.Idclasse4 = this.MaTeam.Team.Classe4.Id.toString();
      }
      //Lancement de la requête et display et récupération des enregistrement.
      //Si NotFound renvoyé par API, message disant que rien n'a été trouvé et de réessayer avec moins de filtres.
      this.enregistrementService.getEnregistrementsByInfos(this.U, this.IdBZ, this.Idclasse1, this.Idclasse2, this.Idclasse3, this.Idclasse4, this.accessService.data["User"]??this.accessService.data["Anonyme"])
      .subscribe(result => {
      this.Enregistrements = result;
      }, error => {
        this.messageIndication = "Oops, aucun enregistrement n'a été trouvé. Essayez peut-être avec moins de filtres!";
      })
    }
  }

  //Mise en favori de l'enregistrement par l'utilisateur
  public mettreFavori(id)
  {
    //Note pour plus tard, modifier fonctionnement API qui attend un modèle complet. => A transformer en Entité non complexe pour éviter de devoir instancier les objects et mettre juste l'Id à l'intérieur.
    let Fav = new Favori({});
    Fav.Enregistrement = new Enregistrement({Id:id});
    Fav.Utilisateur = new Utilisateur({Id:this.currentUser.Id})
    this.favorisService.postFavori(Fav, this.accessService.data["User"]).subscribe(() => { fav$.next(true) });
    zip(fav$).subscribe(() => {
      this.favorisService.getFavorisByUtilisateurId(this.currentUser.Id, this.accessService.data["User"]).subscribe(result =>{
        this.myFavs = result; //Remplissage du tableau avec tous les favoris de l'utilisateur une fois le favori envoyé avec succès via API
      });
    });    
  }

  //Retrait des favoris par l'utilisateur
  public retraitFavori(id)
  {
    for (let elem of this.myFavs) //Parcous de la liste des favoris en local. 
    {
      if(elem.Enregistrement.Id == id) //Si favori trouvé dans la liste (en fonction Id envoyé via la page) 
      {
        //Suppression favoris via API + suppression dans le tableau local si delete OK.
        this.favorisService.deleteFavori(elem.Id, this.accessService.data["User"]).subscribe(() => {});
        this.myFavs = this.myFavs.filter(r => r.Id != elem.Id);
      }
    }
  }

  public VerifFavori(Id):boolean //Permet le display des icones favori OU non favoris (Voir .html)
  {
    let T = false;
    for(let elem of this.myFavs)
    {
      if(elem.Enregistrement.Id == Id) T = true;
    }
    return T;
  }

  //Permet le display des icones de vote + / - / x en fonction des votes déjà effectuées ou non. 
  //A noter qu'a chaque possibilité il y a 2 icones sur trois à faire apparaitre :
  // Si voté + : Display x et -
  // Si voté - : Display x et +
  // Si pas de vote : Display + et -
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

  //Action de vote négatif sur un enregistrement par l'utilisateur en cliquant sur l'icone correspondante
  //Méthode un peu barbare à améliorer (solution temporaire pour éviter les problèmes de votes multiples)
  VoteMoins(Id)
  {
    let V:Vote = new Vote({})
    V.Enregistrement = new Enregistrement({Id:Id})
    V.Utilisateur = new Utilisateur({Id:this.currentUser.Id})
    V.Vote = -1;
    for (let Vote of this.myVotes) //Parcours de la liste des vote existante
    {
      if (Vote.Enregistrement.Id == Id) //Si vote trouvé : suppression du vote + suppression dans le tableau local
      {
        this.voteService.deleteVote(Vote.Id, this.accessService.data["User"]).subscribe(() => {});
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
      }
    }
    //Ajout du nouveau vote + ajout dans le tableau local
    this.voteService.postVote(V, this.accessService.data["User"]).subscribe(() => { vote$.next(true) });
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note--;
    zip(vote$).subscribe(() => {
      this.voteService.getVotesByUser(this.currentUser.Id, this.accessService.data["User"]).subscribe(result =>{
        this.myVotes = result; //Mise à jour du tableau de vote
      })
    })
  }

  //Action de vote positif sur un enregistrement par l'utilisateur en cliquant sur l'icone correspondante
  // Même remarque que méthode précédente
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
        this.voteService.deleteVote(Vote.Id, this.accessService.data["User"]).subscribe(() => {});
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
      }
    }
    this.voteService.postVote(V, this.accessService.data["User"]).subscribe(() => { vote$.next(true) });
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note++;
    zip(vote$).subscribe(() => {
      this.voteService.getVotesByUser(this.currentUser.Id, this.accessService.data["User"]).subscribe(result =>{
        this.myVotes = result;
      });
    });
  }

  //Action de suppression d'un vote (si préalablement voté + ou -) via icone correspondante
  DeleteVote(Id)
  {
    for (let Vote of this.myVotes)
    {
      if (Vote.Enregistrement.Id == Id) 
      {
        this.voteService.deleteVote(Vote.Id, this.accessService.data["User"]).subscribe(() => {});
        if (Vote.Vote == 1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
        if (Vote.Vote == -1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
        this.myVotes = this.myVotes.filter(r => r.Id != Vote.Id);
      }
    }
  }

  //Méthode permettant le changement de texte et le display ou non du texte d'aide quand on clique sur le bouton.
  public ShowHelp(){
    this.Show = !this.Show;
    if (this.TexteButtonHelp == "Afficher l'aide") this.TexteButtonHelp = "Cacher l'aide";
    else if (this.TexteButtonHelp == "Cacher l'aide") this.TexteButtonHelp = "Afficher l'aide";
  }
}
