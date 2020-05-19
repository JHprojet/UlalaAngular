import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Classe } from '../models/classe';
import { ClasseDAL } from '../service/classe-dal';
import { BosszoneDAL } from '../service/bosszone-dal';
import { ImageDAL } from '../service/image-dal';
import { Image } from '../models/image';
import { Enregistrement } from '../models/enregistrement';
import { EnregistrementDAL } from '../service/enregistrement-dal'
import { TeamDal } from '../service/team-dal';
import { BossZone } from '../models/boss-zone';
import { Team } from '../models/team';
import { Utilisateur } from '../models/utilisateur';
import { zip, Subject } from 'rxjs';
import { MesTeams } from '../models/mes-teams';
import { AccessComponent } from '../helpeur/access-component';
import { Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from '../service/Validators/validators';

@Component({
  selector: 'app-add-strategie',
  templateUrl: './add-strategie.component.html',
  styleUrls: ['./add-strategie.component.css']
})

export class AddStrategieComponent implements OnInit {
  //Research form with custom parameters
  AddForm = this.fb.group({
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
    updateOn: 'change', validators: [this.v.CheckContinent, this.v.CheckZone, this.v.CheckBoss, this.v.CheckClasses]});
  //Research form with personal Team  
  AddFormWithTeam = this.fb.group({
    Team: ['', {
      validators: [Validators.required]}],
    Boss: ['', {
      validators: [Validators.required]}],
  },{
    updateOn: 'change', validators: [this.v.CheckBossWithTeam, this.v.CheckTeam]});

  
    // /!\ Réécriture en cours de add-strategy.component - Encore en cours de réalisation /!\

  constructor(private teamService:TeamDal,private imageService:ImageDAL,private cd:ChangeDetectorRef,private classeService:ClasseDAL,private bossZoneService:BosszoneDAL,private accessService:AccessComponent,private v:CustomValidators,private enregistrementService:EnregistrementDAL,private fb:FormBuilder) { }
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
  AddWithTeam = false;
  //Variables utilisées pour utilisation de zip.
  OkImage$:Subject<boolean>;
  //Variables de gestion Images uploadées
  Images = new Array<any>();
  FileNames:string[];
  Loading: boolean;
  errorImage: number;
  UploadOK:boolean;
  UploadFail:boolean;

  ngOnInit(): void {
    this.AddFormWithTeam.get('Boss').disable();
    this.AddForm.get('Boss').disable();
    this.AddForm.get('Zone').disable();
    this.UploadFail = false;
    this.UploadFail = false;
    this.errorImage = 6;
    this.FileNames = new Array<string>();
    if(this.accessService.getSession("Info")) {
      this.accessUser = true;
      if(this.accessService.getSession("Teams").length) {
        this.selectMesTeams = this.accessService.getSession("Teams");
        this.AddWithTeam = true;
      }
      else {
        this.AddWithTeam = false;
        this.selectMesTeams = new Array<MesTeams>();
      }
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
  }

  //Rempli la liste déroulante Zone de SearchBoss
  public GetZones(Continent) {
    this.selectZone = [];
    this.selectBoss = [];
    this.AddForm.controls.Zone.setValue("");
    this.AddForm.controls.Boss.setValue("");
    this.AddForm.controls.Boss.disable();
    this.AddForm.controls.Zone.disable();
    this.AllBossZone.forEach(item => {
      if(item.Zone.ContinentFR == Continent.value && !this.selectZone.includes(item.Zone.ZoneFR)) this.selectZone.push(item.Zone.ZoneFR);
    });
    if(Continent.value != '') this.AddForm.get('Zone').enable();
  }

  //Rempli la liste déroulante boss de SearchBoss
  public GetBoss(Continent,Zone) {
    this.selectBoss = [];
    this.AddForm.controls.Boss.disable();
    this.AddForm.controls.Boss.setValue("");
    this.AddFormWithTeam.controls.Boss.setValue("");
    this.AllBossZone.forEach(item => {
      if(item.Zone.ContinentFR == Continent.value && item.Zone.ZoneFR == Zone.value && !this.selectBoss.includes(item.Boss.NomFR)) this.selectBoss.push(item.Boss.NomFR);
    });
    if(Zone.value != '') this.AddForm.controls.Boss.enable();
  }
  
  //Rempli la liste déroulante boss de SearchBossWithTeam
  GetBossViaTeam(TeamId) {
    this.AddForm.reset();
    this.AddForm.controls.Boss.disable();
    this.AddForm.controls.Zone.disable();
    this.selectBoss = [];
    this.AddFormWithTeam.controls.Boss.setValue("");
    let ZoneId;
    if(TeamId.value != "")
      {
      this.selectMesTeams.forEach(item => {
        if(item.Id == TeamId.value) ZoneId = item.Zone.Id;
      });
      this.AllBossZone.forEach(item => {
        if(ZoneId == item.Zone.Id && !this.selectBoss.includes(item.Boss.NomFR)) this.selectBoss.push(item.Boss.NomFR); 
      });
      this.AddFormWithTeam.get('Boss').enable();
    }
    else this.AddFormWithTeam.get('Boss').disable();
  }
   //Méthode permettant le changement de texte et le display ou non du texte d'aide quand on clique sur le bouton.
   public ShowHelp(){
    this.Show = !this.Show;
  }

  switchForm() { 
    this.AddWithTeam = !this.AddWithTeam
    this.errorImage = 6;
    this.AddForm.reset();
    this.AddFormWithTeam.reset();
    this.AddFormWithTeam.get('Boss').disable();
    this.AddForm.get('Boss').disable();
    this.AddForm.get('Zone').disable();
    let ToClean = document.getElementById("inputImages") as HTMLInputElement;
    if(ToClean) ToClean.value = "";
    let ToClean2 = document.getElementById("inputImagesWithTeam") as HTMLInputElement;
    if(ToClean2) ToClean2.value = "";
  }

  onSubmitWithTeam() {
    let E:Enregistrement = new Enregistrement({Utilisateur:new Utilisateur({Id:1}), BossZone:new BossZone({}), Team:new Team({})})
    this.AllBossZone.forEach(item => {
      if(item.Zone.Id == this.selectMesTeams.find(team => team.Id == this.AddFormWithTeam.value.Team).Zone.Id && item.Boss.NomFR == this.AddFormWithTeam.value.Boss) {
        E.BossZone.Id = item.Id;
        E.Team.Id = this.selectMesTeams.find(team => team.Id == this.AddFormWithTeam.value.Team).Team.Id;
      }
    });
    if(this.accessService.getSession("Info")) { E.Utilisateur.Id = this.accessService.getSession("Info").Id }
    for (let item of this.Images) { this.uploadFile(item); }
    E.ImagePath1 = "http://192.168.1.2:8081/"+this.FileNames[0];
    E.ImagePath2 = "http://192.168.1.2:8081/"+this.FileNames[1];
    E.ImagePath3 = "http://192.168.1.2:8081/"+this.FileNames[2];
    E.ImagePath4 = "http://192.168.1.2:8081/"+this.FileNames[3];
    this.enregistrementService.postStrategy(E).subscribe(result => { 
      this.ngOnInit();
      let ToClean = document.getElementById("inputImages") as HTMLInputElement;
      ToClean.value = "";
      this.UploadOK = true;
      setTimeout(() => this.UploadOK=false,3000)
    }, error => {
      this.UploadFail = true;
      setTimeout(() => this.UploadFail= false,3000)
    })
  }

  onSubmit()
  {
    //Initialize Object to send
    let E:Enregistrement = new Enregistrement({Utilisateur:new Utilisateur({Id:1}), BossZone:new BossZone({}), Team:new Team({})})
    //Get and Add BossZone Id
    this.AllBossZone.forEach(item => {
      if(item.Zone.ZoneFR == this.AddForm.value.Zone && item.Boss.NomFR == this.AddForm.value.Boss) {
        E.BossZone.Id = item.Id;
      }
    });
    //Get and Add Team Id
    let Team$ = new Subject<boolean>();
    this.teamService.getTeamByClasses(this.AddForm.value.Classe1,this.AddForm.value.Classe2,this.AddForm.value.Classe3,this.AddForm.value.Classe4).subscribe(result => {
      E.Team.Id = result.Id;
      Team$.next(true);
    });
    //Add the user Id if connected
    if(this.accessService.getSession("Info")) E.Utilisateur.Id = this.accessService.getSession("Info").Id;
    //Upload of the 4 images
    for (let item of this.Images) { this.uploadFile(item); }
    //Add the "ImagePath" of the 4 images
    E.ImagePath1 = "http://192.168.1.2:8081/"+this.FileNames[0];
    E.ImagePath2 = "http://192.168.1.2:8081/"+this.FileNames[1];
    E.ImagePath3 = "http://192.168.1.2:8081/"+this.FileNames[2];
    E.ImagePath4 = "http://192.168.1.2:8081/"+this.FileNames[3];
    //Wait for the "getTeamByClasses" call to API
    zip(Team$).subscribe(([Team$]) => {
      //Post strategy
      this.enregistrementService.postStrategy(E).subscribe(result => { 
        //Reset form
        this.AddForm.reset();
        this.AddForm.controls.Boss.disable();
        this.AddForm.controls.Zone.disable();
        let ToClean = document.getElementById("inputImages") as HTMLInputElement;
        ToClean.value = "";
        //Display success message (3 secondes duration)
        this.UploadOK = true;
        setTimeout(() => this.UploadOK=false,3000)
      }, error => {
        //Display fail message (5 secondes duration)
        this.UploadFail = true;
        setTimeout(() => this.UploadFail= false,5000)
      })
    });
  }

  //#region | uploadFile | Upload des 4 images une fois ces dernières validées
  public uploadFile(file)
  {
    let IMG = new Image; //Create new Image.
    IMG.fileName = this.newGuid()+file.name; //Add GUID + inital name of the file
    this.FileNames.push(IMG.fileName); //Add to the name list
    IMG.fileSize = file.size; //Add Size of the file
    IMG.fileType = file.type; //Add type of the file
    IMG.lastModifiedTime = file.lastModified; //Add last modified time
    IMG.lastModifiedDate = file.lastModifiedDate; //Add last modified date
    let reader = new FileReader();
    reader.onload = () => {
      IMG.fileAsBase64 = reader.result.toString(); // Store base64 encoded representation of file
      this.imageService.uploadImage(IMG) // POST to server
        .subscribe(resp => { }); ////////////////////////// PROCESS TO ADD
    }  
    reader.readAsDataURL(file); // Read the file
  }

  //#region | checkImages | Méthode de vérification des image pixel par pixel
  public checkImages(T)
  {
    this.OkImage$ = new Subject<boolean>(); //Initialize waiting variable
    this.Images = []; //Initialisation de la liste des 4 images
    this.errorImage = 0; //Vide le message d'erreur
    for (let file of T.files) //Ajout des 4 images à la liste
    {
      this.Images.push(file); 
    }
    if(T.files.length != 4) this.errorImage = 1; //Message erreur si nombre de fichier différent de 4.
    else 
    {
      let test: boolean = true;
      for (let file of T.files)
      { //Vérifie que les fichiers sont uniquement des fichiers image de type png, jpeg, jpg.
        if(this.getExtension(file.name) != "png" && this.getExtension(file.name) != "jpeg" && this.getExtension(file.name) != "jpg") test = false;
      }
      if (!test) this.errorImage = 2; //Message erreur si pas image du bon format.
      //Vérifications que les 4 fichiers ont le même format.
      else if(!(this.getExtension(T.files[0].name) == this.getExtension(T.files[1].name) && this.getExtension(T.files[1].name) == this.getExtension(T.files[2].name) 
              && this.getExtension(T.files[2].name) == this.getExtension(T.files[3].name))) 
              this.errorImage = 3; //Display de l'erreur si pas le même format.
      else
      {
        this.errorImage = 4       
        this.CheckPixels(this.Images); //Méthode de check pixel par pixel
        //Lorsque la méthode CheckPixel se termine
        zip(this.OkImage$).subscribe(([OkImage]) => {
          if(OkImage) { //Si le test pixel par pixel est OK
            this.Loading = false;
            this.errorImage = 0;
            this.AddForm.enable();
            this.AddFormWithTeam.enable();
            //Force la MAJ des données du component (suite bug Firefox)
            this.cd.detectChanges();
            this.cd.markForCheck();
          }
          else if (!OkImage) { //Si le test pixel par pixel est KO
            this.Loading = false;
            this.errorImage = 5;
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

   //#region | CheckPixels | Méthode qui vérifie le nombre de pixel identique pour vérifier que les images sont du format attendu
  //Forte probabilité d'amélioration possible.
  public CheckPixels(Images:any[])
  {
    let scan1$ = new Subject<boolean>();
    let scan2$ = new Subject<boolean>();
    let scan3$ = new Subject<boolean>();
    let scan4$ = new Subject<boolean>();
    let calc1$ = new Subject<boolean>();
    let calc2$ = new Subject<boolean>();
    let calc3$ = new Subject<boolean>();
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
        scan1$.next(true);
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
        scan2$.next(true);
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
        scan3$.next(true);
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
        scan4$.next(true);
      })
    }
    reader1.readAsDataURL(Images[3]);
    //Une fois les 4 tableaux de pixel remplis
    zip(scan1$, scan2$, scan3$, scan4$).subscribe(() => {
      //Vérification du nombre de pixel identique entre les tableaux
      this.CalcPourcentSimil(tab1, tab2, calc1$);
      this.CalcPourcentSimil(tab2, tab3, calc2$);
      this.CalcPourcentSimil(tab3, tab4, calc3$);
    });
    //Une fois les 3 vérifications effectuées
    zip(calc1$, calc2$, calc3$).subscribe(([calc1, calc2, calc3]) => {
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
}