import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { StrategyService, environement } from '../../services';
import { Strategy } from '../../models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-strat',
  templateUrl: './admin-strat.component.html',
  styleUrls: ['./admin-strat.component.css']
})
export class AdminStratComponent implements OnInit {

  constructor(private cd:ChangeDetectorRef, private translate:TranslateService, private modalService: BsModalService, private stratService:StrategyService) { }
  
  //Variable used to display strategies depending on sort and filter
  Strats:Strategy[];
  displayStrat:Strategy[] = new Array<Strategy>();
  //Sorting variables
  Ordre:number;
  ColTri:string;
  //Search fields
  SearchId:string;
  SearchPseudo:string;
  //Modal
  modalRef: BsModalRef;
  //Id to send to the modal for delete
  SupprId:number;
  //Variable langage
  Lang:string;
  //EndPoint Image server
  BaseURL:string;
  

  ngOnInit(): void {
    this.BaseURL = environement.ImagePath;
    //Get current langage
    this.Lang = this.translate.currentLang;
    this.Strats = new Array<Strategy>();
    //Get all strategies
    this.stratService.getStrategies().subscribe(result => {
      this.Strats = result;
    });
    this.SearchId= "";
    this.SearchPseudo= "";
    this.Ordre = 0;
    this.ColTri = "Id";
    this.SupprId = 0;
    //Register to LangChangeEvent and write selected langage in variable Lang
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.Lang = event.lang;
    });
  }

  //Update table depending on PaginatorComponent
  public getPagTable(data) {
    this.displayStrat = data;
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  //Look for strategies depending on filer and sort options selected
  //Need to find a solution about sorting methodes
  Search()
  {
    this.stratService.getStrategies().subscribe(result => {
      this.Strats = result.filter(result => result.Id.toString().includes(this.SearchId) && result.User.Username.includes(this.SearchPseudo));
        if(this.Ordre == 0 && this.ColTri == "Id")  this.Strats = this.Strats.sort(this.TriIdAsc);
        else if (this.Ordre == 1 && this.ColTri == "Id")  this.Strats = this.Strats.sort(this.TriIdDsc);
        else if(this.Ordre == 0 && this.ColTri == "Note")  this.Strats =this.Strats.sort(this.TriNoteAsc);
        else if(this.Ordre == 1 && this.ColTri == "Note")  this.Strats =this.Strats.sort(this.TriNoteDsc);
      });
    }

  //!sort functions
  TriIdAsc(a:Strategy, b:Strategy)
  { if(a.Id > b.Id) return 1; if(b.Id > a.Id) return -1; return 0;  }
  TriIdDsc(a:Strategy, b:Strategy)
  { if(a.Id < b.Id) return 1; if(b.Id < a.Id) return -1; return 0; }
  TriNoteAsc(a:Strategy, b:Strategy)
  { if(a.Note > b.Note) return 1; if(b.Note > a.Note) return -1; return 0; }
  TriNoteDsc(a:Strategy, b:Strategy)
  { if(a.Note < b.Note) return 1; if(b.Note < a.Note) return -1; return 0; }

  //Writing new value on change for sorting purpose
  ChangeTri(Tri) { this.ColTri = Tri.value; }
  ChangeOrdre(Ordre) { this.Ordre = Ordre.value; }

  //Checking yes/no modal for strategies delete
  openModal(template: TemplateRef<any>, Id:number) {
    this.SupprId = Id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  //If "ok" in modal
  confirm(): void {
    ///delete strategy + call API for refresh (better solution to be find for the API call).
    this.stratService.deleteStrategyById(this.SupprId).subscribe(() => {
      this.Search();
     })
    this.modalRef.hide();
  }
 
  //If declined in modal : do nothing.
  decline(): void {
    this.modalRef.hide();
  }
}