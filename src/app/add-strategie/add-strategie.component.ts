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
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-add-strategie',
  templateUrl: './add-strategie.component.html',
  styleUrls: ['./add-strategie.component.css']
})

export class AddStrategieComponent implements OnInit {

  //Upload form with custom parameters
  AddForm = this.fb.group({
    Continent: ['', { validators: [Validators.required]}],
    Zone: ['', { validators: [Validators.required]}],
    Boss: ['', { validators: [Validators.required]}],
    Classe1: [''],
    Classe2: [''],
    Classe3: [''],
    Classe4: ['']
  },{
    updateOn: 'change', validators: [this.v.CheckContinent, this.v.CheckZone, this.v.CheckBoss, this.v.CheckClasses]});
  //Upload form with personal Team  
  AddFormWithTeam = this.fb.group({
    Team: ['', { validators: [Validators.required]}],
    Boss: ['', { validators: [Validators.required]}],
  },{
    updateOn: 'change', validators: [this.v.CheckBossWithTeam, this.v.CheckTeam]});

  constructor(private translate:TranslateService, private teamService:TeamDal, private imageService:ImageDAL,
            private cd:ChangeDetectorRef, private classeService:ClasseDAL, private bossZoneService:BosszoneDAL,
            private accessService:AccessComponent, private v:CustomValidators, private enregistrementService:EnregistrementDAL,
            private fb:FormBuilder) { }
  //Variable to keep available all the BossZone informations
  AllBossZone:BossZone[] = new Array<BossZone>();
  //Variables to feel the selects
  selectContinent:BossZone[] = new Array<BossZone>();
  selectZone:BossZone[] = new Array<BossZone>();
  selectBoss:BossZone[] = new Array<BossZone>();
  selectClasse:Classe[] = new Array<Classe>();
  selectMyTeams:MesTeams[] = new Array<MesTeams>();
  //Boolean for connected user
  accessUser:boolean = false;
  //Variable displaying help
  Show:boolean = false;
  //Variable used to show only the selected form
  AddWithTeam = false;
  //Variables used for images processing
  OkImage$:Subject<boolean>;
  Images = new Array<any>();
  FileNames:string[];
  Loading: boolean;
  errorImage: number;
  UploadOK:boolean;
  UploadFail:boolean;
  //Variable langage
  Lang:string;

  ngOnInit(): void {
    //Get current langage
    this.Lang = this.translate.currentLang;
    //Disable part of the forms (For selects using other selects values)
    this.AddFormWithTeam.get('Boss').disable();
    this.AddForm.get('Boss').disable();
    this.AddForm.get('Zone').disable();
    //Init message displaying variables
    this.UploadFail = false;
    this.UploadOK = false;
    //Init Images processing variables
    this.errorImage = 6;
    this.FileNames = new Array<string>();
    //If a user is connected
    if(this.accessService.getSession("Info")) {
      this.accessUser = true;
      //Get favorites teams of the users (Write in Session)
      if(this.accessService.getSession("Teams").length) {
        this.selectMyTeams = this.accessService.getSession("Teams");
        this.AddWithTeam = true;
      }
      else {
        this.AddWithTeam = false;
        this.selectMyTeams = new Array<MesTeams>();
      }
    }
    //Get all BossZone informations
    this.bossZoneService.getBossZones().subscribe(result => {
      //Writing result in dedicated variable
      this.AllBossZone = result;
      //Feeling selectContinent with unique Continent values
      var unique = [];
      for( let i = 0; i < result.length; i++ ) {
        if( !unique[result[i].Zone.ContinentFR]) {
          this.selectContinent.push(result[i]);
          unique[result[i].Zone.ContinentFR] = 1;
        }
      }
    });
    //Get classes information to feel selectClasse
    this.classeService.getClasses().subscribe(result => {
      this.selectClasse = result;
    });
    //Register to LangChangeEvent and write selected langage in variable Lang
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.Lang = event.lang;
    });
  }

  //Feeling Zone select values (Custom form)
  public GetZones(Continent) {
    //Init cascading values
    this.selectZone = [];
    this.selectBoss = [];
    this.AddForm.controls.Zone.setValue("");
    this.AddForm.controls.Boss.setValue("");
    this.AddForm.controls.Boss.disable();
    this.AddForm.controls.Zone.disable();
    //Feeling selectZone with unique Zone values depending on Continent value
    var unique = [];
    for( let i = 0; i < this.AllBossZone.length; i++ ) {
      if( !unique[this.AllBossZone[i].Zone.ZoneFR] && this.AllBossZone[i].Zone.ContinentFR == Continent.value) {
        this.selectZone.push(this.AllBossZone[i]);
        unique[this.AllBossZone[i].Zone.ZoneFR] = 1;
      }
    }
    //If a value has been selected for Continent, enable Zone control
    if(Continent.value != '') this.AddForm.get('Zone').enable();
  }

  //Feeling Boss select values (Custom form)
  public GetBoss(Continent,Zone) {
    //Init cascading values
    this.selectBoss = [];
    this.AddForm.controls.Boss.disable();
    this.AddForm.controls.Boss.setValue("");
    this.AddFormWithTeam.controls.Boss.setValue("");
    //Feeling selectBoss with unique Boss values depending on Continent and Zone values
    var unique = [];
    for( let i = 0; i < this.AllBossZone.length; i++ ) {
      if( !unique[this.AllBossZone[i].Zone.ZoneFR] 
          && this.AllBossZone[i].Zone.ContinentFR == Continent.value
          && this.AllBossZone[i].Zone.ZoneFR == Zone.value ) {
        this.selectBoss.push(this.AllBossZone[i]);
        unique[this.AllBossZone[i].Boss.NomFR] = 1;
      }
    }
    //If a value have been selected for Zone, enable Zone control
    if(Zone.value != '') this.AddForm.controls.Boss.enable();
  }
  
  //Feeling Boss select values (Favorite team form)
  GetBossViaTeam(MaTeamId) {
    //Init cascading values
    this.selectBoss = [];
    this.AddFormWithTeam.controls.Boss.setValue("");
    //If a team has been selected
    if(MaTeamId.value != "")
    {
      //Get Zone Name corresponding to selected team
      let ZoneFR = this.selectMyTeams.find(team => team.Id == MaTeamId.value).Zone.ZoneFR;
      //Feeling selectBoss with unique Boss values depending on Zone Name
      let unique = [];
      for( let i = 0; i < this.AllBossZone.length; i++ ) {
        if( !unique[this.AllBossZone[i].Zone.ZoneFR] 
            && this.AllBossZone[i].Zone.ZoneFR == ZoneFR ) {
          this.selectBoss.push(this.AllBossZone[i]);
          unique[this.AllBossZone[i].Boss.NomFR] = 1;
        }
      }
      //enable select
      this.AddFormWithTeam.get('Boss').enable();
    }
    //disable select
    else this.AddFormWithTeam.get('Boss').disable();
  }

   //Switch variable Show to display or hide help
  public ShowHelp(){
    this.Show = !this.Show;
  }

  //If user switch form, init both form + init both input type file multiple
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

  //Send strategy to API when submitted with favorite team
  onSubmitWithTeam() {
    //Create strategy to send and add init internal objects **(Must be changed via API to simplify)**
    let E:Enregistrement = new Enregistrement({Utilisateur:new Utilisateur({Id:1}), BossZone:new BossZone({Id:this.AddFormWithTeam.value.Boss}), Team:new Team({})})
    //Feeling Team.Id via form valuer
    E.Team.Id = this.selectMyTeams.find(team => team.Id == this.AddFormWithTeam.value.Team).Id;
    //Adding User Id to the strategy if its a connected user (else Id = 1 is Anonymous player in DB)
    if(this.accessService.getSession("Info")) { E.Utilisateur.Id = this.accessService.getSession("Info").Id }
    //Upload 4 Images
    for (let item of this.Images) { this.uploadFile(item); }
    //Feeling paths of the images to the strategy
    E.ImagePath1 = "http://192.168.1.2:8081/"+this.FileNames[0];
    E.ImagePath2 = "http://192.168.1.2:8081/"+this.FileNames[1];
    E.ImagePath3 = "http://192.168.1.2:8081/"+this.FileNames[2];
    E.ImagePath4 = "http://192.168.1.2:8081/"+this.FileNames[3];
    //Post strategy
    this.enregistrementService.postStrategy(E).subscribe(result => { 
      //If success, reset form + input file and display success message (5s)
      this.AddFormWithTeam.reset();
      this.AddFormWithTeam.controls.Boss.disable();
      let ToClean = document.getElementById("inputImages") as HTMLInputElement;
      ToClean.value = "";
      this.UploadOK = true;
      setTimeout(() => this.UploadOK=false,5000)
    }, error => {
      //If fail, display error message (5s)
      this.UploadFail = true;
      setTimeout(() => this.UploadFail= false,5000)
    })
  }

  //Send strategy to API when submitted with custom form
  onSubmit()
  {
    //Create strategy to send and add init internal objects **(Must be changed via API to simplify)**
    let E:Enregistrement = new Enregistrement({Utilisateur:new Utilisateur({Id:1}), BossZone:new BossZone({}), Team:new Team({})})
    //Add BossZone Id
    E.BossZone.Id = this.AddForm.value.Boss;
    //Add Team Id
    let Team$ = new Subject<boolean>();
    //Get team Id depending on 4 classes
    this.teamService.getTeamByClasses(this.AddForm.value.Classe1,this.AddForm.value.Classe2,this.AddForm.value.Classe3,this.AddForm.value.Classe4).subscribe(result => {
      E.Team.Id = result.Id;
      Team$.next(true);
    });
    //Adding User Id to the strategy if its a connected user (else Id = 1 is Anonymous player in DB)
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
        //If success, reset form + input file + display success message (5s)
        this.AddForm.reset();
        this.AddForm.controls.Boss.disable();
        this.AddForm.controls.Zone.disable();
        let ToClean = document.getElementById("inputImages") as HTMLInputElement;
        ToClean.value = "";
        this.UploadOK = true;
        setTimeout(() => this.UploadOK=false,5000)
      }, error => {
        //If fail, display error message (5s)
        this.UploadFail = true;
        setTimeout(() => this.UploadFail= false,5000)
      })
    });
  }

  //Uploading the 4 images
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
      IMG.fileAsBase64 = reader.result.toString(); //Store base64 encoded representation of file
      this.imageService.uploadImage(IMG) // POST to API
        .subscribe(resp => { }); // **PROCESS TO ADD**
    }  
    reader.readAsDataURL(file); //Read the file
  }

  //Perform full check of the images (Number of images, Extensions, Pixel check)
  public checkImages(T)
  {
    this.OkImage$ = new Subject<boolean>(); //Initialize waiting variable
    this.Images = []; //Initialize image list
    this.errorImage = 0; //Empty errorMessage
    for (let file of T.files) { this.Images.push(file); } //Add the images to the list
    if(T.files.length != 4) this.errorImage = 1; //Error message if not 4 files
    else 
    {
      let test: boolean = true;
      for (let file of T.files)
      { //Check image extension
        if(this.getExtension(file.name) != "png" && this.getExtension(file.name) != "jpeg" && this.getExtension(file.name) != "jpg") test = false;
      }
      if (!test) this.errorImage = 2; //Display error message if 1 image or more have bad extension
      //Check if all files have same extension
      else if(!(this.getExtension(T.files[0].name) == this.getExtension(T.files[1].name) && this.getExtension(T.files[1].name) == this.getExtension(T.files[2].name) 
              && this.getExtension(T.files[2].name) == this.getExtension(T.files[3].name))) 
              this.errorImage = 3; //Display error message if extension not matching
      else
      {
        this.errorImage = 4; //Display processing message
        this.CheckPixels(this.Images); //Check if images are as expected.
        //When check is done
        zip(this.OkImage$).subscribe(([OkImage]) => {
          this.Loading = false; //Stop processing image
          if(OkImage) { //If test = OK
            this.errorImage = 0; //Delete error
            this.AddForm.enable(); //Enable forms
            this.AddFormWithTeam.enable(); //Enable forms
            //Following Firefox bug, force Angular update
            this.cd.detectChanges();
            this.cd.markForCheck();
          }
          else if (!OkImage) { //Si le test pixel par pixel est KO
            this.errorImage = 5; //Error message
          }
        });
      }
    }
  }
  
  //Get extension of a file
  public getExtension(path) {
    var basename = path.split(/[\\/]/).pop();  // Extract file name (Supporting '\\' and '/')
    let pos = basename.lastIndexOf('.');       // Look for '.' position
    if (basename === '' || pos < 1) return ""; // If file name is empty or the '.' is not found or is in first position
    return basename.slice(pos + 1);            // Extract extension without the '.'
  }

  //Create GUID (almost)
  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  //Check images between them pixel by pixels
  public CheckPixels(Images:any[]):void
  {
    //Init waiting variables (for pixel scan and checking pixel table between images)
    let scan1$ = new Subject<boolean>();
    let scan2$ = new Subject<boolean>();
    let scan3$ = new Subject<boolean>();
    let scan4$ = new Subject<boolean>();
    let calc1$ = new Subject<boolean>();
    let calc2$ = new Subject<boolean>();
    let calc3$ = new Subject<boolean>();
    //Init pixel's tables
    let tab1 = [];
    let tab2 = [];
    let tab3 = [];
    let tab4 = [];
    //Create 4 readers (Prefering 4 than 1 so can process 4 images synchronously)
    let reader = new FileReader();
    let reader1 = new FileReader();
    let reader2 = new FileReader();
    let reader3 = new FileReader();
    //Activate Processing animation
    this.Loading = true;
    //Feeling 4 pixel's tables
    this.GetPixels(reader, scan1$, tab1);
    this.GetPixels(reader1, scan2$, tab2);
    this.GetPixels(reader2, scan3$, tab3);
    this.GetPixels(reader3, scan4$, tab4);
    reader.readAsDataURL(Images[0]);
    reader1.readAsDataURL(Images[1]);
    reader2.readAsDataURL(Images[2]);
    reader3.readAsDataURL(Images[3]);
    //Once the 4 images have been processed
    zip(scan1$, scan2$, scan3$, scan4$).subscribe(() => {
      //Checking differences between images
      this.CalcPourcentSimil(tab1, tab2, calc1$);
      this.CalcPourcentSimil(tab2, tab3, calc2$);
      this.CalcPourcentSimil(tab3, tab4, calc3$);
    });
    //Once the 3 verifications are done
    zip(calc1$, calc2$, calc3$).subscribe(([calc1, calc2, calc3]) => {
      if (calc1 && calc2 && calc3 ) this.OkImage$.next(true); // If checking is OK, Subject to true;
      else this.OkImage$.next(false); // If checking is NOK, Subject to false;
    });
  }

  //Reader used to feel a pixel's table and return a Subject when done processing
  GetPixels(reader:FileReader,subject$:Subject<boolean>,tab:Array<number>):void
  {
    var Jimp = require('jimp');
    reader.onload = () => {
      Jimp.read(reader.result.toString()).then(image => {
        image.resize(100,220);
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
          tab.push(image.getPixelColor(x, y));
        })
        subject$.next(true);
      })
    }
  }
  
  //Check the % of identical pixels between 2 pixel's table
  public CalcPourcentSimil(IMG1:any[], IMG2:any[], subject$):void
  {
    let samePixel:number = 0;
    let percent:number = 0;
    //For each pixel identical NumIdenti
    for(let i=0; i<=IMG1.length;i++) { if(IMG1[i] == IMG2[i]) { samePixel++; } }
    percent = samePixel / IMG1.length * 100;
    if(percent > 25) subject$.next(true); //Subject to true if 25%+ pixels matches
    else subject$.next(false); //else subject to false
  }
}