import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Utilisateur } from '../models/utilisateur';
import { AccessComponent } from '../helpeur/access-component';
import { zip } from 'rxjs';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';
import { ClasseDAL } from '../service/classe-dal';
import { Classe } from '../models/classe';
import { MesTeams } from '../models/mes-teams';
import { TeamDal } from '../service/team-dal';
import { EnregistrementDAL } from '../service/enregistrement-dal';
import { Enregistrement } from '../models/enregistrement';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  SearchForm = this.fb.group({
    Continent: [''],
    Zone: [''],
    Boss: [''],
    Classe1: [''],
    Classe2: [''],
    Classe3: [''],
    Classe4: ['']
  },{
    updateOn: 'blur', validators: []});
  SearchFormWithTeam = this.fb.group({
    Team: [''],
    Boss: ['']
  },{
    updateOn: 'change', validators: []});

    // /!\ Réécriture en cours de search.component - Encore en cours de réalisation /!\

  constructor(private enregistrementService:EnregistrementDAL,private teamService:TeamDal,private classeService:ClasseDAL,private bossZoneService:BosszoneDAL,private accessService:AccessComponent,private utilisateurService:UtilisateurDAL, private fb:FormBuilder, private cv:CustomValidators) { }
  AllBossZone:BossZone[] = new Array<BossZone>();
  selectContinent:string[] = new Array<string>();
  selectZone:string[] = new Array<string>();
  selectBoss:string[] = new Array<string>();
  selectClasse:Classe[] = new Array<Classe>();
  selectTeams:MesTeams[] = new Array<MesTeams>();
  Enregistrements:Enregistrement[] = new Array<Enregistrement>();
  accessUser:boolean = false;
  Show:boolean = false;
  selectMesTeams:MesTeams[] = new Array<MesTeams>();

  ngOnInit(): void {
    this.SearchFormWithTeam.get('Boss').disable();
    this.SearchForm.get('Boss').disable();
    this.SearchForm.get('Zone').disable();
    if(this.accessService.data["Info"]) {
      this.accessUser = true;
      this.selectMesTeams = this.accessService.data["Teams"];
    }
    zip(this.accessService.CheckAno$).subscribe(() => {
      this.bossZoneService.getBossZones(this.accessService.data['Anonyme']).subscribe(result => {
        this.AllBossZone = result;
        this.AllBossZone.forEach(element => {
          if(!this.selectContinent.includes(element.Zone.ContinentFR))this.selectContinent.push(element.Zone.ContinentFR);
        });
      });
      this.classeService.getClasses(this.accessService.data['Anonyme']).subscribe(result => {
        this.selectClasse = result;
      });
    });
  }

  onSubmit() {
    let User ="", BossZoneId="", C1="", C2="", C3="", C4="", ZoneIdOfTheSelectedTeam;
    //Faire if route = alors User =
    
    if(this.SearchFormWithTeam.value.Boss != '') {
      this.AllBossZone.forEach(item => {
        if(item.Zone.Id == this.selectMesTeams.find(team => team.Id == this.SearchFormWithTeam.value.Team).Zone.Id
            && item.Boss.NomFR == this.SearchFormWithTeam.value.Boss) {
              console.log(item.Boss.NomFR);
              BossZoneId = item.Id.toString();
            }
      });
     this.accessService.data["Teams"].forEach(item => {
       if(item.Id == this.SearchFormWithTeam.value.Team) {
         C1 = item.Team.Classe1.Id;
         C2 = item.Team.Classe2.Id;
         C3 = item.Team.Classe3.Id;
         C4 = item.Team.Classe4.Id;
       }
     });
    }
    else {
      if(this.SearchForm.value.Boss != "") {
        this.AllBossZone.forEach(item => {
          if(item.Zone.ContinentFR == this.SearchForm.value.Continent 
              && item.Zone.ZoneFR == this.SearchForm.value.Zone 
              && item.Boss.NomFR == this.SearchForm.value.Boss)
          BossZoneId = item.Id.toString();
        });
        C1 = this.SearchForm.value.Classe1;
        C2 = this.SearchForm.value.Classe2;
        C3 = this.SearchForm.value.Classe3;
        C4 = this.SearchForm.value.Classe4;
      }
     
      
    }
    
    this.enregistrementService.getEnregistrementsByInfos(User, BossZoneId, C1, C2, C3, C4, this.accessService.data["Anonyme"]).subscribe(result => {
      this.Enregistrements = result;
    });                                            
  }

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
  
  GetBossViaTeam(TeamId) {
    this.SearchForm.reset();
    this.SearchForm.controls.Boss.disable();
    this.SearchForm.controls.Zone.disable();
    this.selectBoss = [];
    this.SearchFormWithTeam.controls.Boss.setValue("");
    let ZoneId;
    if(TeamId.value != "")
      {
      this.accessService.data["Teams"].forEach(item => {
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
