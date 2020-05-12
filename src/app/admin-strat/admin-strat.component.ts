import { Component, OnInit, TemplateRef } from '@angular/core';
import { EnregistrementDAL } from '../service/enregistrement-dal';
import { Enregistrement } from '../models/enregistrement';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-admin-strat',
  templateUrl: './admin-strat.component.html',
  styleUrls: ['./admin-strat.component.css']
})
export class AdminStratComponent implements OnInit {

  constructor(private modalService: BsModalService, private enregistrementService:EnregistrementDAL) { }
  
  // Note sur component :
  // Ajouter une pagination !!!

  BaseStrats:Enregistrement[];
  Strats:Enregistrement[];
  SearchId:string;
  SearchPseudo:string;
  modalRef: BsModalRef;
  SupprId:number;
  Ordre:number;
  ColTri:string;

  ngOnInit(): void {
    this.BaseStrats = new Array<Enregistrement>();
    this.Strats = new Array<Enregistrement>();
    //Récupération de tous les enregistrements.
    this.enregistrementService.getEnregistrements().subscribe(result => {
      this.BaseStrats = result;
    });
    this.SearchId= "";
    this.SearchPseudo= "";
    this.SupprId = 0;
    this.Ordre = 0;
    this.ColTri = "Id";
  }

  //Recherche des enregistrement en fonction des données indiqué via liste déroulante sur le filtre et le tri.
  Search()
  {
    this.enregistrementService.getEnregistrements().subscribe(result => {
      this.BaseStrats = result; //Toutes les strats sont stocké dans this.BaseStrats - this.Strats sera pour le display uniquement.
      this.Strats = this.BaseStrats.filter(result => result.Id.toString().includes(this.SearchId) && result.Utilisateur.Pseudo.includes(this.SearchPseudo));
        //Permet le tri de la liste en fonction des choix via liste déroulante après filtrage. Solution à trouver pour simplifier l'écriture.
        if(this.Ordre == 0 && this.ColTri == "Id") this.Strats = this.Strats.sort(this.TriIdAsc);
        else if (this.Ordre == 1 && this.ColTri == "Id") this.Strats = this.Strats.sort(this.TriIdDsc);
        else if(this.Ordre == 0 && this.ColTri == "Note") this.Strats = this.Strats.sort(this.TriNoteAsc);
        else if(this.Ordre == 1 && this.ColTri == "Note") this.Strats = this.Strats.sort(this.TriNoteDsc);
      });
    }

  //Fonctions de tri en fonction des possibilités
  //Solution à trouver pour faire une seule méthode
  //Test non concluant de l'ajout de paramètres ou de l'utilisation de variables du component pour changer l'action dans une seule méthode
  TriIdAsc(a:Enregistrement, b:Enregistrement)
  { if(a.Id > b.Id) return 1; if(b.Id > a.Id) return -1; return 0;  }
  TriIdDsc(a:Enregistrement, b:Enregistrement)
  { if(a.Id < b.Id) return 1; if(b.Id < a.Id) return -1; return 0; }
  TriNoteAsc(a:Enregistrement, b:Enregistrement)
  { if(a.Note > b.Note) return 1; if(b.Note > a.Note) return -1; return 0; }
  TriNoteDsc(a:Enregistrement, b:Enregistrement)
  { if(a.Note < b.Note) return 1; if(b.Note < a.Note) return -1; return 0; }

  //Assignation nouvelle valeur pour le tri lorsque changement sur liste déroulante.
  ChangeTri(Tri) { this.ColTri = Tri.value; }
  ChangeOrdre(Ordre) { this.Ordre = Ordre.value; }

  //Gestion du modal pour vérification de suppression de l'enregistrement.
  openModal(template: TemplateRef<any>, Id:number) {
    this.SupprId = Id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  //Si confirmation sur le modal
  confirm(): void {
    //Si confirmer, suppression de l'enregistrement + mise à jour de la liste
    this.enregistrementService.deleteEnregistrement(this.SupprId).subscribe(() => { })
    this.Search(); //A remplacer plus tard par une suppression en paralèlle dans le tableau local plutôt que rapeler la fonction Search qui passe pas l'API.
    this.modalRef.hide();
  }
 
  //Si refus sur le modal - Do nothing
  decline(): void {
    this.modalRef.hide();
  }
}
