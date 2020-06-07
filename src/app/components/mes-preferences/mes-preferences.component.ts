import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Team, User, Zone, Classe, CharactersConfiguration, BossesPerZone } from '../../models';
import { TeamService, BossesPerZoneService, ClasseService, CharactersConfigurationService, 
         CustomValidators, AccessService } from '../../services';

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
  AllBossZone:BossesPerZone[] = new Array<BossesPerZone>();
  //Variables to fill in the selects
  selectContinent:BossesPerZone[] = new Array<BossesPerZone>();
  selectZone:BossesPerZone[] = new Array<BossesPerZone>();
  selectClasse:Classe[] = new Array<Classe>();
  //Variables displaying or not messages
  displaySuccessAdd:boolean;
  displaySuccessEdit:boolean;
  displayError:boolean;
  //Variables with all personnal team of the user
  mesTeams:Team[];

  constructor(private translate:TranslateService, private v:CustomValidators, private fb:FormBuilder, private accessService:AccessService,private classeService:ClasseService,private ccService:CharactersConfigurationService,private bzService:BossesPerZoneService, private teamService:TeamService) { }

  ngOnInit(): void {
    //Get current langage
    this.Lang = this.translate.currentLang;
    //Disable part of the forms (For selects using other selects values)
    this.TeamForm.get('Zone').disable();
    //Get all BossZone informations
    this.bzService.getBossesPerZones().subscribe(result => {
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
    else this.mesTeams = new Array<Team>();
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
    let teamAdd = new Team({
      User: new User({Id:this.accessService.getSession("Info").Id}),
      TeamName: this.TeamForm.value.NomTeam,
      Zone: new Zone({Id:this.TeamForm.value.Zone}),
      CharactersConfiguration: new CharactersConfiguration({})
    });
    //Hide messages
    this.displaySuccessAdd = false;
    this.displaySuccessEdit = false;
    this.displayError = false;
    //If Id of the form = "" >> Add mode
    if(this.TeamForm.value.Id == "" || this.TeamForm.value.Id == undefined) {
      //Get Team Id and add to teamAdd variable
      this.ccService.getCharactersConfigurationByClasses(this.TeamForm.value.Classe1,this.TeamForm.value.Classe2,this.TeamForm.value.Classe3,this.TeamForm.value.Classe4).subscribe(result => {
        teamAdd.CharactersConfiguration.Id = result.Id;
        //Post team to API
        this.teamService.postTeam(teamAdd).subscribe(() => {
          //On success : Get teams of the current user + update table + update Session + reset form + Display success message (5s)
          this.teamService.getTeamsByUserId(this.accessService.getSession("Info").Id).subscribe(result => {
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
      this.ccService.getCharactersConfigurationByClasses(this.TeamForm.value.Classe1,this.TeamForm.value.Classe2,this.TeamForm.value.Classe3,this.TeamForm.value.Classe4).subscribe(result => {
        teamAdd.CharactersConfiguration.Id = result.Id;
        //Put team to API
        this.teamService.putTeamById(teamAdd, this.TeamForm.value.Id).subscribe(() => {
          //On success : Get teams of the current user + update table + update Session + reset form + Display success message (5s)
          this.teamService.getTeamsByUserId(this.accessService.getSession("Info").Id).subscribe(result =>{
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
    this.teamService.deleteTeamById(id).subscribe(() => {
      this.mesTeams.splice(this.mesTeams.findIndex(team => team.Id == id),1);
      this.accessService.setSession("Teams",this.mesTeams);
    });
  }

  //Fill in Form with values of the team to edit
  public EditTeam(id)
  {
    let teamEdit = this.accessService.getSession("Teams").filter(team => team.Id == id);
    this.TeamForm.controls.NomTeam.setValue(teamEdit[0].TeamName);
    this.TeamForm.controls.Id.setValue(teamEdit[0].Id);
    this.TeamForm.controls.Classe1.setValue(teamEdit[0].CharactersConfiguration.Classe1.Id);
    this.TeamForm.controls.Classe2.setValue(teamEdit[0].CharactersConfiguration.Classe2.Id);
    this.TeamForm.controls.Classe3.setValue(teamEdit[0].CharactersConfiguration.Classe3.Id);
    this.TeamForm.controls.Classe4.setValue(teamEdit[0].CharactersConfiguration.Classe4.Id);
    this.TeamForm.controls.Continent.setValue(teamEdit[0].Zone.ContinentFR);
    this.GetZones(this.TeamForm.controls.Continent);
    this.TeamForm.controls.Zone.setValue(teamEdit[0].Zone.Id);
  }  
}
