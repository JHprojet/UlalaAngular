import { Component, OnInit, Inject,TemplateRef  } from '@angular/core';
import { EnregistrementDAL } from '../service/enregistrement-dal';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { UtilisateurDAL } from '../service/utilisateur-dal';
import { Enregistrement } from '../models/enregistrement';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-strat',
  templateUrl: './admin-strat.component.html',
  styleUrls: ['./admin-strat.component.css']
})
export class AdminStratComponent implements OnInit {

  constructor(private modalService: BsModalService,@Inject(SESSION_STORAGE) private session: WebStorageService,private routerService:Router, private enregistrementService:EnregistrementDAL) { 
    
  }
  BaseStrats:Enregistrement[];
  Strats:Enregistrement[];
  SearchId:string;
  SearchPseudo:string;
  modalRef: BsModalRef;
  SupprId:number;
  Ordre:number;
  ColTri:string;

  ngOnInit(): void {
    if(!this.session.get("TKA") || !this.session.get("TK") || !this.session.get("User") || this.session.get("User").Role != "Admin")
    {
      this.routerService.navigateByUrl("/")
    }
    this.BaseStrats = new Array<Enregistrement>();
    this.Strats = new Array<Enregistrement>();
    this.enregistrementService.getEnregistrements(this.session.get("TK")).subscribe(result => {
      this.BaseStrats = result;
    })
    this.SearchId= "";
    this.SearchPseudo= "";
    this.SupprId = 0;
    this.Ordre = 0;
    this.ColTri = "Id";
  }

  Search()
  {
    this.enregistrementService.getEnregistrements(this.session.get("TK")).subscribe(result => {
      this.BaseStrats = result;
      this.Strats = this.BaseStrats.filter(result => result.Id.toString().includes(this.SearchId) && result.Utilisateur.Pseudo.includes(this.SearchPseudo));
      console.log(this.Ordre);
      if(this.Ordre == 0 && this.ColTri == "Id") this.Strats = this.Strats.sort(this.TriIdAsc);
      else if (this.Ordre == 1 && this.ColTri == "Id") this.Strats = this.Strats.sort(this.TriIdDsc);
      else if(this.Ordre == 0 && this.ColTri == "Note") this.Strats = this.Strats.sort(this.TriNoteAsc);
      else if(this.Ordre == 1 && this.ColTri == "Note") this.Strats = this.Strats.sort(this.TriNoteDsc);
    })
    
  }

  TriIdAsc(a:Enregistrement, b:Enregistrement)
  { if(a.Id > b.Id) return 1; if(b.Id > a.Id) return -1; return 0;  }
  TriIdDsc(a:Enregistrement, b:Enregistrement)
  { if(a.Id < b.Id) return 1; if(b.Id < a.Id) return -1; return 0; }

  TriNoteAsc(a:Enregistrement, b:Enregistrement)
  { if(a.Note > b.Note) return 1; if(b.Note > a.Note) return -1; return 0; }
  TriNoteDsc(a:Enregistrement, b:Enregistrement)
  { if(a.Note < b.Note) return 1; if(b.Note < a.Note) return -1; return 0; }

  ChangeTri(Tri) { this.ColTri = Tri.value; }
  ChangeOrdre(Ordre) { this.Ordre = Ordre.value;
  }

  openModal(template: TemplateRef<any>, Id:number) {
    this.SupprId = Id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.enregistrementService.deleteEnregistrement(this.SupprId, this.session.get("TK")).subscribe(() => { })
    this.Search();
    this.modalRef.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
  }

}
