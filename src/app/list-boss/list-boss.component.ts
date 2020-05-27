import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossZone } from '../models/boss-zone';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';

@Component({
  selector: 'app-list-boss',
  templateUrl: './list-boss.component.html',
  styleUrls: ['./list-boss.component.css']
})
export class ListBossComponent implements OnInit {

  constructor(private v:CustomValidators,private fb:FormBuilder,private cd:ChangeDetectorRef,private translate:TranslateService,private serviceBossZone:BosszoneDAL) { }
  //Full Boss List
  FullBossList:BossZone[];
  //BossList to send to PaginatorComponent
  BossList:BossZone[];
  //Boss list display (depending on pagination)
  displayBossList:BossZone[];
  //Langage
  Lang:string;
  //Search field
  selectContinent:BossZone[] = new Array<BossZone>();
  selectZone:BossZone[] = new Array<BossZone>();
  //SearchForm
  SearchForm = this.fb.group({
    Continent: [''],
    Zone: ['']
  },{
    updateOn: 'change'});

  ngOnInit(): void {
    //Get current langage
    this.Lang = this.translate.currentLang;
    this.SearchForm.get('Zone').disable();
    this.FullBossList = new Array<BossZone>();
    this.BossList = new Array<BossZone>();
    this.serviceBossZone.getBossZones().subscribe(result =>{
      this.FullBossList = result;
      this.BossList = result;
      //Feeling selectContinent with unique Continent values
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
  }

  //Update table depending on PaginatorComponent
  public getPagTable(data) {
    this.displayBossList = data;
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  //Feeling Zone select values (Custom form)
  public GetZones(Continent) {
    //Init cascading values
    this.selectZone = [];
    this.SearchForm.controls.Zone.setValue("");
    this.SearchForm.controls.Zone.disable();
    //Feeling selectZone with unique Zone values depending on Continent value
    var unique = [];
    for( let i = 0; i < this.FullBossList.length; i++ ) {
      if( !unique[this.FullBossList[i].Zone.ZoneFR] && this.FullBossList[i].Zone.ContinentFR == Continent.value) {
        this.selectZone.push(this.FullBossList[i]);
        unique[this.FullBossList[i].Zone.ZoneFR] = 1;
      }
    }
    //If a value has been selected for Continent, enable Zone control
    if(Continent.value != '') this.SearchForm.get('Zone').enable();
  }
  
  //Filter Table
  onSubmit()
  {
    if (this.SearchForm.value.Continent == "") this.BossList = this.FullBossList;
    else this.BossList = this.FullBossList.filter(BZ => BZ.Zone.ContinentFR.includes(this.SearchForm.value.Continent) && BZ.Zone.ZoneFR.toString().includes(this.SearchForm.value.Zone))
  }
}

