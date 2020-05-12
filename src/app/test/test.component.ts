import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { AccessComponent } from '../helpeur/access-component';
import { zip } from 'rxjs';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/classe';
import { MesTeams } from '../models/mes-teams';
import { EnregistrementDAL } from '../service/enregistrement-dal';
import { Enregistrement } from '../models/enregistrement';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
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
    updateOn: 'change', validators: []});
  SearchFormWithTeam = this.fb.group({
    Team: ['', {
      validators: [Validators.required]}],
    Boss: ['', {
      validators: [Validators.required]}]
  },{
    updateOn: 'change', validators: []});

    // /!\ Réécriture en cours de search.component - Encore en cours de réalisation /!\

  constructor(private activatedRoute:ActivatedRoute,private enregistrementService:EnregistrementDAL,private classeService:ClasseDAL,private bossZoneService:BosszoneDAL,private accessService:AccessComponent,private utilisateurService:UtilisateurDAL, private fb:FormBuilder, private cv:CustomValidators) { }
  //Mise en mémoire de la liste de tous les boss par zone
  AllBossZone:BossZone[] = new Array<BossZone>();
  //Variables de remplissage des select
  selectContinent:string[] = new Array<string>();
  selectZone:string[] = new Array<string>();
  selectBoss:string[] = new Array<string>();
  selectClasse:Classe[] = new Array<Classe>();
  selectMesTeams:MesTeams[] = new Array<MesTeams>();
  //Liste des enregistrements trouvés pour affichage
  Enregistrements:Enregistrement[] = new Array<Enregistrement>();
  //S'il s'agit d'un utilisateur connecté
  accessUser:boolean = false;
  //Variable d'affichage/hide de l'aide
  Show:boolean = false;
  //Route actuelle
  currentRoute:string;
  //Variable de display des messages
  ShowAucunEnregistrement:boolean = false;

  ngOnInit(): void {
    //Récupération route actuelle
    this.activatedRoute.url.subscribe(params => {
      this.currentRoute = params[0].path;
    })
    //Disable de certains champs des formulaires
    this.SearchFormWithTeam.get('Boss').disable();
    this.SearchForm.get('Boss').disable();
    this.SearchForm.get('Zone').disable();
    //Si un utilisateur est connecté récupère ses teams persos
    if(this.accessService.getSession("Info")) {
      this.accessUser = true;
      this.selectMesTeams = this.accessService.getSession("Teams");
    }
    //Dès que le token anonyme est bien réceptionné ou si existait déjà
    zip(this.accessService.CheckAno$).subscribe(() => {
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
    });
  }

  onSubmit() {
    let User ="", BossZoneId="", C1="", C2="", C3="", C4="";
    this.ShowAucunEnregistrement = false;
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
    this.enregistrementService.getEnregistrementsByInfos(User, BossZoneId, C1, C2, C3, C4).subscribe(result => {
      this.Enregistrements = [];
      this.Enregistrements = result;
    }, error => 
    {
      this.Enregistrements = [];
      this.ShowAucunEnregistrement = true; //Display message : pas d'enregistrement trouvé
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
}
