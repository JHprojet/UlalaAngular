import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Classe } from '../models/classe';
import { ClasseDAL } from '../service/classe-dal';
import { ZoneDAL } from '../service/zone-dal';
import { BosszoneDAL } from '../service/bosszone-dal';
import { BossDAL } from '../service/boss-dal';
import { Zone } from '../models/zone';
import { Boss } from '../models/boss';
import { ImageDAL } from '../service/image-dal';
import { Image } from '../models/image';
import { Enregistrement } from '../models/enregistrement';
import { EnregistrementDAL } from '../service/enregistrement-dal'
import { TeamDal } from '../service/team-dal';
import { BossZone } from '../models/boss-zone';
import { Team } from '../models/team';
import { Utilisateur } from '../models/utilisateur';
import { ReplaySubject, zip } from 'rxjs';
import { MesTeams } from '../models/mes-teams';
import { MesTeamsDAL } from '../service/mesteams-dal';
import { AccessComponent } from '../helpeur/access-component';

@Component({
  selector: 'app-add-strategie',
  templateUrl: './add-strategie.component.html',
  styleUrls: ['./add-strategie.component.css']
})

export class AddStrategieComponent implements OnInit {
  //Variables utilisées pour utilisation de zip.
  OkImage$:ReplaySubject<boolean>; 
  scan1$:ReplaySubject<boolean>; scan2$:ReplaySubject<boolean>; scan3$:ReplaySubject<boolean>; scan4$:ReplaySubject<boolean>; 
  calc1$:ReplaySubject<boolean>; calc2$:ReplaySubject<boolean>; calc3$:ReplaySubject<boolean>; 
  //Tableaux de remplissage des listes déroulantes.
  selectClasse: Classe[];
  selectContinent: Zone[];
  selectZone: Zone[];
  selectBoss: Boss[];
  selectMesTeams: MesTeams[];
  //Variables de gestion de l'enregistrement à envoyer en DB
  Enregistrement:Enregistrement;
  currentUser:Utilisateur;
  MaTeam:MesTeams;
  Idclasse1: number;
  Idclasse2: number;
  Idclasse3: number;
  Idclasse4: number;
  zoneId: number = 0;
  IdBZ: string;
  //Variables de gestion Images uploadées
  Images = new Array<any>();
  FileNames:string[];
  Loading: boolean;
  //Variables de display/hide messages error/success
  messageBossZone:string;
  DisplayBoutonSansTeam:boolean;
  DisplayMessageClasse: boolean;
  messageIndication:string;
  errorImage: string;
  UploadOK:string;
  UploadFail:string;
  //Variables de gestion de l'aide (Display/Hide)
  Show:boolean;

  constructor(private accessService:AccessComponent, private cd:ChangeDetectorRef,private mesTeamsService:MesTeamsDAL, private enregistrementService:EnregistrementDAL,private imageService:ImageDAL, private classeService:ClasseDAL, private zoneService:ZoneDAL, private bossZoneService:BosszoneDAL, private bossService:BossDAL, private teamService:TeamDal) { }

  // /!\ Note Globale /!\ : 
  // - Le component doit être simplifié en passant par un FormBuilder
  // - Supprimer la récupération des teams perso via API >> Maintenant disponible via Session Storage dès la connexion.

  //#region | ngOnInit |
  ngOnInit(): void {
    this.messageIndication="Si vous le souhaitez, vous pouvez choisir directement votre team perso et le boss. Sinon, ne remplir que les lignes suivantes.";
    this.Loading = false;
    this.DisplayBoutonSansTeam = true;
    this.Show = false;
    this.MaTeam = new MesTeams({Id:0});
    this.selectClasse = new Array<Classe>();
    this.selectContinent = new Array<Zone>();
    this.selectMesTeams = new Array<MesTeams>();
    this.currentUser = new Utilisateur({});
    if(this.accessService.getSession("Info")) 
    {
      this.currentUser = this.accessService.getSession("Info");
      this.mesTeamsService.getMeTeamsByUserId(this.currentUser.Id).subscribe(result => {
        this.selectMesTeams = result;
      })
    }
    else this.currentUser.Id = 0;
    
    this.classeService.getClasses().subscribe(result =>{
      this.selectClasse = result;
    });
    this.zoneService.getZones().subscribe(response => {
      response.forEach(item => {
        if (this.selectContinent.findIndex(sc => sc.ContinentFR == item.ContinentFR) == -1) {
          this.selectContinent.push(item);
        }
      });
    });
    this.Idclasse1 = 0;
    this.Idclasse2 = 0; 
    this.Idclasse3 = 0; 
    this.Idclasse4 = 0;
    this.selectZone = new Array<Zone>();
    this.selectBoss = new Array<Boss>();
    this.DisplayMessageClasse = true;
    this.IdBZ = "0";
    this.messageBossZone = "Veuillez sélectionner un Continent.";
    this.zoneId = 0;
    this.errorImage = "Veuillez sélectionner les 4 images de votre stratégie.";
    this.Images = new Array<any>();
    this.Enregistrement = new Enregistrement( { Utilisateur: new Utilisateur({Id:1}) })
    this.FileNames = new Array<string>();
    this.UploadOK="";
    this.UploadFail="";
  }
  //#endregion

  //#region | changeContinent | Action lors du changement du continent en liste déroulante
  public changeContinent(Continent)
  {
    //Réinitialisation de la liste déroulante de zone et boss et de L'IdBossZone
    this.selectZone = [];
    this.selectBoss = [];
    this.IdBZ = "";
    //Si valeur vide sélectionnée => Message d'erreur
    if (Continent.value == 0) this.messageBossZone = "Veuillez sélectionner un Continent.";
    //Sinon => Récupération de la liste des zones correspondante au continent sélectionné pour remplir liste déroulante zones
    else {
      this.messageBossZone = "Veuillez sélectionner une Zone."
      this.zoneService.getZones().subscribe(response => {     
        response.forEach(item => {
          if (item.ContinentFR == Continent.value) {
            this.selectZone.push(item);
          }
        });
      });
    }
  }
  //#endregion

  //#region | changeZone | Action lors du changement de la zone en liste déroulante
  public changeZone(Zone)
  {
    //Réinitialisation de la liste déroulante de boss et de L'IdBossZone
    this.selectBoss = [];
    this.IdBZ = "0";
    //Si valeur vide sélectionnée => Message d'erreur
    if (Zone.value == 0) this.messageBossZone = "Veuillez sélectionner une Zone.";
    //Sinon => Récupération de la liste de boss correspondante à la zone sélectionné pour remplir liste déroulante boss
    else {
      this.bossZoneService.getBossZones().subscribe(response => {
        this.messageBossZone = "Veuillez sélectionner un Boss."
        response.forEach(item => {
          if (item.Zone.Id == Zone.value) {
            this.zoneId = item.Zone.Id;
            this.bossService.getBoss(item.Boss.Id).subscribe(response => {
              this.selectBoss.push(response);
            });
          }
        });
      });
    }
  }
  //#endregion

  //#region | changeBoss | Action lors du changement du boss en liste déroulante
  public changeBoss(Boss)
  {
    //Si valeur vide sélectionnée => Message d'erreur
    if (Boss.value == 0) 
    {
      this.messageBossZone = "Veuillez sélectionner un Boss.";
      this.messageIndication = "Veuillez sélectionner un Boss.";
    }
    //Sinon => Récupération de l'Id BossZone
    else {
      if (!this.DisplayBoutonSansTeam) this.messageIndication = "";
      this.messageBossZone = "";
      this.bossZoneService.getBossZones().subscribe(response => {
        response.forEach(item => {
          if (Boss.value == item.Boss.Id && this.zoneId == item.Zone.Id) { this.Enregistrement.BossZone = new BossZone({Id:item.Id}) }
        });
      });
    }
  }
  //#endregion

  //#region | uploadFile | Upload des 4 images une fois ces dernières validées
  public uploadFile(file)
  {
    let IMG = new Image; //Création nouvelle Image.
    IMG.fileName = this.newGuid()+file.name; //Ajout d'un GUID (approx) + nom initial du fichier
    this.FileNames.push(IMG.fileName); //Ajout à la liste de nom de fichiers
    IMG.fileSize = file.size; //Ajout Taille
    IMG.fileType = file.type; //Ajout type
    IMG.lastModifiedTime = file.lastModified; //Ajout time dernière modif
    IMG.lastModifiedDate = file.lastModifiedDate; //Ajout date dernière modif
    let reader = new FileReader();
    reader.onload = () => {
      IMG.fileAsBase64 = reader.result.toString(); // Store base64 encoded representation of file
      this.imageService.uploadImage(IMG) // POST to server
        .subscribe(resp => { }); //Process avec message à rajouter si erreur.
    }  
    reader.readAsDataURL(file); // Read the file
  }
  
  public upload()
  {
    if(this.accessService.getSession("Info"))
    {
      this.Enregistrement.Utilisateur.Id = this.accessService.getSession("Info").Id
    }
    for (let item of this.Images)
    {
      this.uploadFile(item);
    }
    this.Enregistrement.ImagePath1 = "http://192.168.1.2:8081/"+this.FileNames[0];
    this.Enregistrement.ImagePath2 = "http://192.168.1.2:8081/"+this.FileNames[1];
    this.Enregistrement.ImagePath3 = "http://192.168.1.2:8081/"+this.FileNames[2];
    this.Enregistrement.ImagePath4 = "http://192.168.1.2:8081/"+this.FileNames[3];
    this.enregistrementService.postEnregistrement(this.Enregistrement).subscribe(result => { 
      this.ngOnInit();
      let ToClean = document.getElementById("inputImages") as HTMLInputElement;
      ToClean.value = "";
      this.UploadOK = "Stratégie bien importée, merci pour votre partage!";
      setTimeout(() => this.UploadOK="",3000)
    }, error => {
      this.UploadFail = "Oops, il semblerait qu'un problème soit survenue (quel webmaster de merde quand même). Veuillez réessayer.";
      setTimeout(() => this.UploadFail="",3000)
    })
  }
  //#endregion
 
  //#region | changeClasse | Méthodes (x4) de changement des variables et messages d'erreur lors de la sélection d'une classe
  //A améliorer plus tard en transformant les 4 variables en un tableau de variable (permettant une seule méthode)
  public changeClasse1(classe)
  {
    this.DisplayMessageClasse = false;  //Cache le message d'erreur
    this.Idclasse1 = classe.value;      //Ajout de la valeur de la classe choisi dans la variable associée
    //Si Toutes les classes n'ont pas été sélectionnées => Display message erreur
    if( this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.DisplayMessageClasse = true;
    //Sinon lancement méthode de récupération de l'Id de la team correspondante
    else{ this.EcritureIdClasse() }
  }
  public changeClasse2(classe)
  {
    this.DisplayMessageClasse = false;
    this.Idclasse2 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.DisplayMessageClasse = true;
    else{
      this.EcritureIdClasse()
    }
  }
  public changeClasse3(classe)
  {
    this.DisplayMessageClasse = false;
    this.Idclasse3 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.DisplayMessageClasse = true;
    else {
      this.EcritureIdClasse()
    }
  }
  public changeClasse4(classe)
  {
    this.DisplayMessageClasse = false;
    this.Idclasse4 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.DisplayMessageClasse = true;
    else {
      this.EcritureIdClasse()
    }
  }
  //#endregion

  //#region | checkImages | Méthode de vérification des image pixel par pixel
  public checkImages(T)
  {
    this.Images = []; //Initialisation de la liste des 4 images
    this.errorImage = ""; //Vide le message d'erreur
    for (let file of T.files) //Ajout des 4 images à la liste
    {
      this.Images.push(file); 
    }
    if(T.files.length != 4) this.errorImage = "Vous devez sélectionner 4 images."; //Message erreur si nombre de fichier différent de 4.
    else 
    {
      let test: boolean = true;
      for (let file of T.files)
      { //Vérifie que les fichiers sont uniquement des fichiers image de type png, jpeg, jpg.
        if(this.getExtension(file.name) != "png" && this.getExtension(file.name) != "jpeg" && this.getExtension(file.name) != "jpg") test = false;
      }
      if (!test) this.errorImage = "Vos fichiers doivent être uniquement au format JPG, JPEG ou PNG"; //Message erreur si pas image du bon format.
      //Vérifications que les 4 fichiers ont le même format.
      else if(!(this.getExtension(T.files[0].name) == this.getExtension(T.files[1].name) && this.getExtension(T.files[1].name) == this.getExtension(T.files[2].name) 
              && this.getExtension(T.files[2].name) == this.getExtension(T.files[3].name))) 
              this.errorImage = "Vos 4 fichiers doivent être du même format (JPG, JPEG, PNG)"; //Display de l'erreur si pas le même format.
      else
      {
        this.errorImage = "Processing, please wait..."
        //Réinitialisation des variables d'attente
        this.OkImage$ = new ReplaySubject<boolean>();
        this.scan1$ = new ReplaySubject<boolean>();
        this.scan2$ = new ReplaySubject<boolean>();
        this.scan3$ = new ReplaySubject<boolean>();
        this.scan4$ = new ReplaySubject<boolean>();
        this.calc1$ = new ReplaySubject<boolean>();
        this.calc2$ = new ReplaySubject<boolean>();
        this.calc3$ = new ReplaySubject<boolean>();
        this.CheckPixels(this.Images); //Méthode de check pixel par pixel
        //Lorsque la méthode CheckPixel se termine
        zip(this.OkImage$).subscribe(([OkImage]) => {
          if(OkImage) { //Si le test pixel par pixel est OK
            this.Loading = false;
            this.errorImage = "";
            //Force la MAJ des données du component (suite bug Firefox)
            this.cd.detectChanges();
            this.cd.markForCheck();
          }
          else if (!OkImage) { //Si le test pixel par pixel est KO
            this.Loading = false;
            this.errorImage = "Vos 4 images doivent être comme spécifié dans l'aide (voir l'aide plus haut)."
          }
        });
      }
    }
  }
  //#endregion
  
  //#region | getExtension | Récupération de l'extension du fichier
  public getExtension(path) {
    var basename = path.split(/[\\/]/).pop();  // Extrait le nom du fichier (supporte les séparateurs '\\' et '/')
    let pos = basename.lastIndexOf('.');       // Cherche la position du '.'
    if (basename === '' || pos < 1) return ""; // Si le nom est vide ou le '.' est introuvale (-1) ou arrive en premier (0)
    return basename.slice(pos + 1);            // Extrait l'extension sans le '.'
  }
  //#endregion

  //#region | newGuid | Création chaîne de caractère GUID (enfin presque)
  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  //#endregion

  //#region | EcritureIdClasse | Récupération de l'id de la team correspondante à l'Id des 4 classes
  public EcritureIdClasse()
  {
    this.teamService.getTeamByClasses(this.Idclasse1,this.Idclasse2,this.Idclasse3,this.Idclasse4).subscribe(result => {
      this.Enregistrement.Team = new Team({Id : result.Id});
    });
  }
  //#endregion

  //#region | ShowHelp | Gestion du booléen qui affiche et cache l'aide
  public ShowHelp() { this.Show = !this.Show; }
  //#endregion

  //#region | CheckPixels | Méthode qui vérifie le nombre de pixel identique pour vérifier que les images sont du format attendu
  //Forte probabilité d'amélioration possible.
  public CheckPixels(Images:any[])
  {
    //Création d'un tableau de pixel par image
    let tab1 = [];
    let tab2 = [];
    let tab3 = [];
    let tab4 = [];
    //Création des 4 readers (A noter : trouver une solution pour n'avoir qu'un reader)
    let reader = new FileReader();
    let reader1 = new FileReader();
    let reader2 = new FileReader();
    let reader3 = new FileReader();
    //Passage Loading a true pour activer le message et le logo de Loading
    this.Loading = true;
    //Import de Jimp
    var Jimp = require('jimp');
    //A noter : Solution à trouver pour éviter la répétition sur les 4 prochaines méthodes
    //Remplissage tableau de pixel image 1
    reader.onload = () => {
      Jimp.read(reader.result.toString()).then(image => {
        image.resize(100,220);
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
          tab1.push(image.getPixelColor(x, y));
        })
        this.scan1$.next(true);
      })
    }
    reader.readAsDataURL(Images[0]);
    //Remplissage tableau de pixel image 2
    reader2.onload = () => {
      Jimp.read(reader2.result.toString()).then(image => {
        image.resize(100,220);
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
          tab2.push(image.getPixelColor(x, y));
        })
        this.scan2$.next(true);
      })
    }
    reader2.readAsDataURL(Images[1]);
    //Remplissage tableau de pixel image 3
    reader3.onload = () => {
      Jimp.read(reader3.result.toString()).then(image => {
        image.resize(100,220);
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
          tab3.push(image.getPixelColor(x, y));
        });
        this.scan3$.next(true);
      })
    }
    reader3.readAsDataURL(Images[2]);
    //Remplissage tableau de pixel image 4
    reader1.onload = () => {
       Jimp.read(reader1.result.toString()).then(image => {
        image.resize(100,220);
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
          tab4.push(image.getPixelColor(x, y));
        })
        this.scan4$.next(true);
      })
    }
    reader1.readAsDataURL(Images[3]);
    //Une fois les 4 tableaux de pixel remplis
    zip(this.scan1$, this.scan2$, this.scan3$, this.scan4$).subscribe(() => {
      //Vérification du nombre de pixel identique entre les tableaux
      this.CalcPourcentSimil(tab1, tab2, this.calc1$);
      this.CalcPourcentSimil(tab2, tab3, this.calc2$);
      this.CalcPourcentSimil(tab3, tab4, this.calc3$);
    });
    //Une fois les 3 vérifications effectuées
    zip(this.calc1$, this.calc2$, this.calc3$).subscribe(([calc1, calc2, calc3]) => {
      if (calc1 && calc2 && calc3 ) this.OkImage$.next(true); // Si les 3 vérifications sont à true renvoi le Subject à true;
      else this.OkImage$.next(false); //Sinon false
    });
  }
  //#endregion

  //#region | CalcPourcentSimil | Méthode qui vérifie le nombre de pixel entre 2 tableaux de pixel. Retourne true ou false.
  public CalcPourcentSimil(IMG1:any[], IMG2:any[], C$)
  {
    let NumTot:number = 0;
    let NumIdentique:number = 0;
    let Percent:number = 0;
    for (let element of IMG1)
    {
      if(element == IMG2[NumTot]) { NumIdentique++; }
      NumTot++;
    }
    Percent = NumIdentique / NumTot * 100;
    if(Percent > 25) C$.next(true); //Si + de 25% identique OK
    else C$.next(false); //sinon KO
  }
  //#endregion

  //#region | choixMaTeam | Action si sélection d'une team perso
  public choixMaTeam(T)
  {
    //Si choix vide
    if (T.value == 0)
    {
      //Reset de la liste déroulante Boss + Reset message indicatif + Reset de l'Id de la team + Display bouton possible sans utilisation de la team perso
      this.selectBoss = [];
      this.messageIndication= "Si vous le souhaitez, vous pouvez choisir directement votre team perso et le boss. Sinon, ne remplir que les lignes suivantes.";
      this.MaTeam = new MesTeams({Id:0});
      this.DisplayBoutonSansTeam = true;
    }
    else {
      //Récupération + écriture de l'Id de la team correspondante aux 4 classes + Suppression du display du bouton via détail
      this.mesTeamsService.getMaTeam(T.value).subscribe(result => {
        this.MaTeam = result;
        this.Enregistrement.Team = new Team({Id : result.Team.Id});
        this.DisplayBoutonSansTeam = false;
      });
      //Réinitialisation des variables de gestion + Récupération de la liste des bosses correspondant à la zone de la team perso de l'utilisateur
      this.bossZoneService.getBossZones().subscribe(response => {
        this.selectBoss = [];
        this.IdBZ = "0";
        this.messageIndication = "Veuillez sélectionner un Boss."
        response.forEach(item => {
          if (item.Zone.Id == this.MaTeam.Zone.Id) {
            this.zoneId = item.Zone.Id;
            this.bossService.getBoss(item.Boss.Id).subscribe(response => {
              this.selectBoss.push(response);
            });
          }
        })
      });
    }
  }
  //#endregion
}


  
