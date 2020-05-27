import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../models/utilisateur';
import { MesTeams } from '../models/mes-teams';
import { MesTeamsDAL } from '../service/mesteams-dal';
import { Zone } from '../models/zone';
import { Classe } from '../models/Classe';
import { ZoneDAL } from '../service/zone-dal';
import { BossDAL } from '../service/boss-dal';
import { BosszoneDAL } from '../service/bosszone-dal';
import { TeamDal } from '../service/team-dal';
import { ClasseDAL } from '../service/classe-dal';
import { Team } from '../models/team';
import { AccessComponent } from '../helpeur/access-component';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BossZone } from '../models/boss-zone';

@Component({
  selector: 'app-mes-preferences',
  templateUrl: './mes-preferences.component.html',
  styleUrls: ['./mes-preferences.component.css']
})
export class MesPreferencesComponent implements OnInit {
  //Research form with custom parameters
  TeamForm = this.fb.group({
    Id: [''],
    NomTeam: ['', {
      validators: [Validators.required]}],
    Continent: ['', {
      validators: [Validators.required]}],
    Zone: ['', {
      validators: [Validators.required]}],
    Classe1: [''],
    Classe2: [''],
    Classe3: [''],
    Classe4: ['']
  },{
    updateOn: 'change', validators:  [this.v.CheckContinent, this.v.CheckZone, this.v.CheckClasses]});
  
  //Variable Lang
  Lang:string;
  //Variable to keep available all the BossZone informations
  AllBossZone:BossZone[] = new Array<BossZone>();
  //Variables to fill in the selects
  selectContinent:BossZone[] = new Array<BossZone>();
  selectZone:BossZone[] = new Array<BossZone>();
  selectClasse:Classe[] = new Array<Classe>();
  //Variables displaying or not messages
  displaySuccessAdd:boolean;
  displaySuccessEdit:boolean;
  displayError:boolean;
  //Variables with all personnal team of the user
  mesTeams:MesTeams[];

  constructor(private translate:TranslateService, private v:CustomValidators, private fb:FormBuilder, private accessService:AccessComponent,private classeService:ClasseDAL,private teamService:TeamDal,private bossZoneService:BosszoneDAL,private bossService:BossDAL,private zoneService:ZoneDAL, private mesteamsService:MesTeamsDAL) { }

  ngOnInit(): void {
    //Get current langage
    this.Lang = this.translate.currentLang;
    //Disable part of the forms (For selects using other selects values)
    this.TeamForm.get('Zone').disable();
    //Get all BossZone informations
    this.bossZoneService.getBossZones().subscribe(result => {
      //Writing result in dedicated variable
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
    //Register to LangChangeEvent and write selected langage in variable Lang
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.Lang = event.lang;
    });
    //Get classes information to fill in selectClasse
    this.selectClasse = new Array<Classe>();
    this.classeService.getClasses().subscribe(result => {
      this.selectClasse = result;
    });
    //Init display variables
    this.displaySuccessAdd = false;
    this.displaySuccessEdit = false;
    this.displayError = false;
    //Get personal teams from Session (Or init empty table of Teams if no personal teams)
    if(this.accessService.getSession("Teams")) this.mesTeams = this.accessService.getSession("Teams");
    else this.mesTeams = new Array<MesTeams>();
  }

   //Fill in Zone select values (Custom form)
   public GetZones(Continent) {
    //Init cascading values
    this.selectZone = [];
    this.TeamForm.controls.Zone.setValue("");
    this.TeamForm.controls.Zone.disable();
    //Fill in selectZone with unique Zone values depending on Continent value
    var unique = [];
    for( let i = 0; i < this.AllBossZone.length; i++ ) {
      if( !unique[this.AllBossZone[i].Zone.ZoneFR] && this.AllBossZone[i].Zone.ContinentFR == Continent.value) {
        this.selectZone.push(this.AllBossZone[i]);
        unique[this.AllBossZone[i].Zone.ZoneFR] = 1;
      }
    }
    //If a value has been selected for Continent, enable Zone control
    if(Continent.value != '') this.TeamForm.get('Zone').enable();
  }

  onSubmit()
  {
    //Init team to add via API with values
    let teamAdd = new MesTeams({
      Utilisateur: new Utilisateur({Id:this.accessService.getSession("Info").Id}),
      NomTeam: this.TeamForm.value.NomTeam,
      Zone: new Zone({Id:this.TeamForm.value.Zone}),
      Team: new Team({})
    });
    //Hide messages
    this.displaySuccessAdd = false;
    this.displaySuccessEdit = false;
    this.displayError = false;
    //If Id of the form = "" >> Add mode
    if(this.TeamForm.value.Id == "" || this.TeamForm.value.Id == undefined) {
      //Get Team Id and add to teamAdd variable
      this.teamService.getTeamByClasses(this.TeamForm.value.Classe1,this.TeamForm.value.Classe2,this.TeamForm.value.Classe3,this.TeamForm.value.Classe4).subscribe(result => {
        teamAdd.Team.Id = result.Id;
        //Post team to API
        this.mesteamsService.postMyTeam(teamAdd).subscribe(() => {
          //On success : Get teams of the current user + update table + update Session + reset form + Display success message (5s)
          this.mesteamsService.getMyTeamsByUserId(this.accessService.getSession("Info").Id).subscribe(result => {
            this.mesTeams = result;
            this.accessService.setSession("Teams", result);
          });
          this.TeamForm.reset();
          this.displaySuccessAdd = true;
          setTimeout(() => { this.displaySuccessAdd = false}, 5000);
        }, error => {
          //On error : Display error message (5s)
          this.displayError = true
          setTimeout(() => { this.displayError = false}, 5000);
        });
      });
    }
    //If Id of the form != "" >> Edit mode
    else {
      //Get Team Id and add to teamAdd variable
      this.teamService.getTeamByClasses(this.TeamForm.value.Classe1,this.TeamForm.value.Classe2,this.TeamForm.value.Classe3,this.TeamForm.value.Classe4).subscribe(result => {
        teamAdd.Team.Id = result.Id;
        //Put team to API
        this.mesteamsService.putMyTeamById(teamAdd, this.TeamForm.value.Id).subscribe(() => {
          //On success : Get teams of the current user + update table + update Session + reset form + Display success message (5s)
          this.mesteamsService.getMyTeamsByUserId(this.accessService.getSession("Info").Id).subscribe(result =>{
            this.mesTeams = result;
            this.accessService.setSession("Teams",this.mesTeams);
          });
          this.displaySuccessEdit = true;
          this.TeamForm.reset();
          setTimeout(() => { this.displaySuccessEdit = false}, 5000);
        }, error => {
          //On error : Display error message (5s)
          this.displayError = true
          setTimeout(() => { this.displayError = false}, 5000);
        });
      });
    }
  }

  //Delete Team
  public DeleteTeam(id)
  {
    //Delete via API and update table and Session on Success
    this.mesteamsService.deleteMyTeamById(id).subscribe(() => {
      this.mesTeams.splice(this.mesTeams.findIndex(team => team.Id == id),1);
      this.accessService.setSession("Teams",this.mesTeams);
    });
  }

  //Fill in Form with values of the team to edit
  public EditTeam(id)
  {
    let teamEdit = this.accessService.getSession("Teams").filter(team => team.Id == id);
    this.TeamForm.controls.NomTeam.setValue(teamEdit[0].NomTeam);
    this.TeamForm.controls.Id.setValue(teamEdit[0].Id);
    this.TeamForm.controls.Classe1.setValue(teamEdit[0].Team.Classe1.Id);
    this.TeamForm.controls.Classe2.setValue(teamEdit[0].Team.Classe2.Id);
    this.TeamForm.controls.Classe3.setValue(teamEdit[0].Team.Classe3.Id);
    this.TeamForm.controls.Classe4.setValue(teamEdit[0].Team.Classe4.Id);
    this.TeamForm.controls.Continent.setValue(teamEdit[0].Zone.ContinentFR);
    this.GetZones(this.TeamForm.controls.Continent);
    this.TeamForm.controls.Zone.setValue(teamEdit[0].Zone.Id);
  }  
}
