import { Component, OnInit } from '@angular/core';
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

    // /!\ Réécriture en cours de search.component - Encore en cours de réalisation /!\

  constructor(private voteService:VoteDAL,private favService:FavoriDAL,private v:CustomValidators,private activatedRoute:ActivatedRoute,private enregistrementService:EnregistrementDAL,private classeService:ClasseDAL,private bossZoneService:BosszoneDAL,private accessService:AccessComponent,private utilisateurService:UtilisateurDAL, private fb:FormBuilder, private cv:CustomValidators) { }
  //Mise en mémoire de la liste de tous les boss par zone
  AllBossZone:BossZone[] = new Array<BossZone>();
  //Variables de remplissage des select
  selectContinent:string[] = new Array<string>();
  selectZone:string[] = new Array<string>();
  selectBoss:string[] = new Array<string>();
  selectClasse:Classe[] = new Array<Classe>();
  selectMesTeams:MesTeams[] = new Array<MesTeams>();
  //S'il s'agit d'un utilisateur connecté
  accessUser:boolean = false;
  //Variable d'affichage/hide de l'aide
  Show:boolean = false;
  //Route actuelle
  currentRoute:string;
  //Variable de display des messages
  DisplayNoEnregistrementMessage:boolean = false;
  //Variable de stockage des Votes et Favoris
  myVotes:Vote[];
  myFavs:Favori[];
  //Getter et Setter pour les stratégies (Le getter permet de retourner les stratégies en favori si sur la route "favstrat" sinon, renvoi tous les élements)
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
    //Récupération route actuelle
    this.activatedRoute.url.subscribe(params => {
      this.currentRoute = params[0].path;
    })
    //Disable de certains champs des formulaires
    this.SearchFormWithTeam.get('Boss').disable();
    this.SearchForm.get('Boss').disable();
    this.SearchForm.get('Zone').disable();
    //Si un utilisateur est connecté récupère ses teams persos, ses favoris et ses votes
    if(this.accessService.getSession("Info")) {
      this.accessUser = true;
      if(this.accessService.getSession("Teams")) this.selectMesTeams = this.accessService.getSession("Teams");
      else this.selectMesTeams = new Array<MesTeams>();
      if(this.accessService.getSession("Fav"))  this.myFavs = this.accessService.getSession("Fav");
      else  this.myFavs = new Array<Favori>();
      if(this.accessService.getSession("Votes")) this.myVotes = this.accessService.getSession("Votes");
      else this.myVotes = new Array<Vote>();
    }
    //Récupération de la liste des boss par zone
    this.bossZoneService.getBossZones().subscribe(result => {
      this.AllBossZone = result;
      this.AllBossZone.forEach(element => {
        if(!this.selectContinent.includes(element.Zone.ContinentFR))this.selectContinent.push(element.Zone.ContinentFR);
      });
    });
    this.classeService.getClasses().subscribe(result => {
      this.selectClasse = result;
    });
    //Init Enregistrements
    this.Enregistrements = new Array<Enregistrement>();
  }

  onSubmit() {
    let User ="", BossZoneId="", C1="", C2="", C3="", C4="";
    this.DisplayNoEnregistrementMessage = true;
    //Rempli User avec l'id de l'utilisateur si la route est "mystrat" pour n'afficher que les enregistrements publiés par l'utilisateur
    if(this.currentRoute == 'mystrat') User = this.accessService.getSession("Info").Id.toString();
    //Rempli les données de recherche si choix fait d'une team perso
    if(this.SearchFormWithTeam.valid) {
      this.AllBossZone.forEach(item => {
        if(item.Zone.Id == this.selectMesTeams.find(team => team.Id == this.SearchFormWithTeam.value.Team).Zone.Id && item.Boss.NomFR == this.SearchFormWithTeam.value.Boss) {
          BossZoneId = item.Id.toString();
        }
      });
      this.selectMesTeams.forEach(item => {
       if(item.Id == this.SearchFormWithTeam.value.Team) {
         C1 = item.Team.Classe1.Id.toString();
         C2 = item.Team.Classe2.Id.toString();
         C3 = item.Team.Classe3.Id.toString();
         C4 = item.Team.Classe4.Id.toString();
       }
     });
    }
    //Rempli les données de recherche si choix fait d'une recherche à la main
    else if(this.SearchForm.value.Boss != "") {
      this.AllBossZone.forEach(item => {
        if(item.Zone.ContinentFR == this.SearchForm.value.Continent && item.Zone.ZoneFR == this.SearchForm.value.Zone && item.Boss.NomFR == this.SearchForm.value.Boss)
          BossZoneId = item.Id.toString();
      });
      C1 = this.SearchForm.value.Classe1;
      C2 = this.SearchForm.value.Classe2;
      C3 = this.SearchForm.value.Classe3;
      C4 = this.SearchForm.value.Classe4;
    }
    //Lancement de la recherche
    this.enregistrementService.getStrategiesByInfos(User, BossZoneId, C1, C2, C3, C4).subscribe(result => {
      this.Enregistrements = [];
      this.Enregistrements = result;
    }, error => 
    {
      this.Enregistrements = [];
    });                                            
  }

  //Rempli la liste déroulante Zone de SearchBoss
  public GetZones(Continent) {
    this.selectZone = [];
    this.selectBoss = [];
    this.SearchForm.controls.Zone.setValue("");
    this.SearchForm.controls.Boss.setValue("");
    this.SearchForm.controls.Boss.disable();
    this.SearchForm.controls.Zone.disable();
    this.AllBossZone.forEach(item => {
      if(item.Zone.ContinentFR == Continent.value && !this.selectZone.includes(item.Zone.ZoneFR)) this.selectZone.push(item.Zone.ZoneFR);
    });
    if(Continent.value != '') this.SearchForm.get('Zone').enable();
  }

  //Rempli la liste déroulante boss de SearchBoss
  public GetBoss(Continent,Zone) {
    this.selectBoss = [];
    this.SearchForm.controls.Boss.disable();
    this.SearchForm.controls.Boss.setValue("");
    this.SearchFormWithTeam.controls.Boss.setValue("");
    this.AllBossZone.forEach(item => {
      if(item.Zone.ContinentFR == Continent.value && item.Zone.ZoneFR == Zone.value && !this.selectBoss.includes(item.Boss.NomFR)) this.selectBoss.push(item.Boss.NomFR);
    });
    if(Zone.value != '') this.SearchForm.controls.Boss.enable();
  }
  
  //Rempli la liste déroulante boss de SearchBossWithTeam
  GetBossViaTeam(TeamId) {
    this.SearchForm.reset();
    this.SearchForm.controls.Boss.disable();
    this.SearchForm.controls.Zone.disable();
    this.selectBoss = [];
    this.SearchFormWithTeam.controls.Boss.setValue("");
    let ZoneId;
    if(TeamId.value != "")
      {
      this.selectMesTeams.forEach(item => {
        if(item.Id == TeamId.value) ZoneId = item.Zone.Id;
      });
      this.AllBossZone.forEach(item => {
        if(ZoneId == item.Zone.Id && !this.selectBoss.includes(item.Boss.NomFR)) this.selectBoss.push(item.Boss.NomFR); 
      });
      this.SearchFormWithTeam.get('Boss').enable();
    }
    else this.SearchFormWithTeam.get('Boss').disable();
  }
   //Méthode permettant le changement de texte et le display ou non du texte d'aide quand on clique sur le bouton.
   public ShowHelp(){
    this.Show = !this.Show;
  }

  //Mise en favori de l'enregistrement par l'utilisateur
  public mettreFavori(id)
  {
    //Note pour plus tard, modifier fonctionnement API qui attend un modèle complet. => A transformer en Entité non complexe pour éviter de devoir instancier les objects et mettre juste l'Id à l'intérieur.
    let fav$ = new Subject<boolean>();
    let Fav = new Favori({});
    Fav.Enregistrement = new Enregistrement({Id:id});
    Fav.Utilisateur = new Utilisateur({Id:this.accessService.getSession("Info").Id})
    this.favService.postFavorite(Fav).subscribe(() => { fav$.next(true) });
    zip(fav$).subscribe(() => {
      this.favService.getFavoritesByUserId(this.accessService.getSession("Info").Id).subscribe(result =>{
        this.myFavs = result; //Remplissage du tableau avec tous les favoris de l'utilisateur une fois le favori envoyé avec succès via API
        this.accessService.setSession("Fav",this.myFavs);
      });
    });    
  }

  //Retrait des favoris par l'utilisateur
  public retraitFavori(id)
  {
    for (let elem of this.myFavs) { //Parcous de la liste des favoris en local. 
      if(elem.Enregistrement.Id == id) { //Si favori trouvé dans la liste (en fonction Id envoyé via la page) 
        //Suppression favoris via API + suppression dans le tableau local si delete OK.
        this.favService.deleteFavoriteById(elem.Id).subscribe(() => {});
        this.myFavs = this.myFavs.filter(r => r.Id != elem.Id);
        this.accessService.setSession("Fav",this.myFavs);
      }
    }
  }

  public DisplayFavori(Id):boolean //Permet le display des icones favori OU non favoris (Voir .html)
  {
    let T = false;
    for(let elem of this.myFavs) { if(elem.Enregistrement.Id == Id) T = true; }
    return T;
  }

  //Permet le display des icones de vote + / - / x en fonction des votes déjà effectuées ou non. 
  //A noter qu'a chaque possibilité il y a 2 icones sur trois à faire apparaitre :
  // Si voté + : Display x et -
  // Si voté - : Display x et +
  // Si pas de vote : Display + et -
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

  //Action de vote négatif sur un enregistrement par l'utilisateur en cliquant sur l'icone correspondante
  //Méthode un peu barbare à améliorer (solution temporaire pour éviter les problèmes de votes multiples)
  VoteMoins(Id)
  {
    let vote$ = new Subject<boolean>();
    let V:Vote = new Vote({})
    V.Enregistrement = new Enregistrement({Id:Id})
    V.Utilisateur = new Utilisateur({Id:this.accessService.getSession("Info").Id})
    V.Vote = -1;
    for (let Vote of this.myVotes) //Parcours de la liste des votes existants
    {
      if (Vote.Enregistrement && Vote.Enregistrement.Id == Id) //Si vote trouvé : suppression du vote + suppression dans le tableau local
      {
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
      }
    }
    //Ajout du nouveau vote + ajout dans le tableau local
    this.voteService.postVote(V).subscribe(() => { vote$.next(true) });
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note--;
    zip(vote$).subscribe(() => {
      this.voteService.getVotesByUser(this.accessService.getSession("Info").Id).subscribe(result =>{
        
        this.myVotes = result; 
        this.accessService.setSession("Votes",this.myVotes);
      })
    })
  }

  //Action de vote positif sur un enregistrement par l'utilisateur en cliquant sur l'icone correspondante
  // Même remarque que méthode précédente
  VotePlus(Id)
  {
    let vote$ = new Subject<boolean>();
    let V:Vote = new Vote({})
    V.Enregistrement = new Enregistrement({Id:Id})
    V.Utilisateur = new Utilisateur({Id:this.accessService.getSession("Info").Id})
    V.Vote = 1;
    for (let Vote of this.myVotes)
    {
      if (Vote.Enregistrement && Vote.Enregistrement.Id == Id) 
      {
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
      }
    }
    this.voteService.postVote(V).subscribe(() => { vote$.next(true) });
    this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Id)].Note++;
    zip(vote$).subscribe(() => {
      this.voteService.getVotesByUser(this.accessService.getSession("Info").Id).subscribe(result =>{
        this.myVotes = result;
        this.accessService.setSession("Votes",this.myVotes);
      });
    });
  }

  //Action de suppression d'un vote (si préalablement voté + ou -) via icone correspondante
  DeleteVote(Id)
  {
    for (let Vote of this.myVotes)
    {
      if (Vote.Enregistrement && Vote.Enregistrement.Id == Id) 
      {
        this.voteService.deleteVoteById(Vote.Id).subscribe(() => {});
        if (Vote.Vote == 1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note--;
        if (Vote.Vote == -1) this.Enregistrements[this.Enregistrements.findIndex(r => r.Id == Vote.Enregistrement.Id)].Note++;
        this.myVotes = this.myVotes.filter(r => r.Id != Vote.Id);
        this.accessService.setSession("Votes",this.myVotes);
      }
    }
  }
}
