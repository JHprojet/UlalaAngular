import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-add-strategie',
  templateUrl: './add-strategie.component.html',
  styleUrls: ['./add-strategie.component.css']
})
export class AddStrategieComponent implements OnInit {

  selectClasse: Classe[];
  selectContinent: Zone[];
  selectZone: Zone[];
  selectBoss: Boss[];
  Idclasse1: number;
  Idclasse2: number;
  Idclasse3: number;
  Idclasse4: number;
  messageClasse: string;
  IdBZ: string;
  messageBossZone:string;
  zoneId: number = 0;
  errorImage: string;
  Images = new Array<any>();
  Enregistrement:Enregistrement;
  FileNames:string[];
  UploadOK:string;
  UploadFail:string;

  constructor(private appService:AppComponent,private router:Router, private enregistrementService:EnregistrementDAL,private imageService:ImageDAL, private classeService:ClasseDAL, private zoneService:ZoneDAL, private bossZoneService:BosszoneDAL, private bossService:BossDAL, private teamService:TeamDal) { }

  ngOnInit(): void {
    this.selectClasse = new Array<Classe>();
    this.selectContinent = new Array<Zone>();
    this.classeService.getClasses().subscribe(result =>{
      this.selectClasse = result;
    })
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
    this.messageClasse = "Veuillez sélectionner les 4 classes.";
    this.IdBZ = "0";
    this.messageBossZone = "Veuillez sélectionner un Continent.";
    this.zoneId = 0;
    this.errorImage = "Veuillez sélectionner les 4 images de votre stratégie."
    this.Images = new Array<any>();
    this.Enregistrement = new Enregistrement( {
      Utilisateur: new Utilisateur({Id:1})
      })
    this.FileNames = new Array<string>();
    this.UploadOK="";
    this.UploadFail="";
    }
    public changeContinent(Continent)
    {
      this.selectZone = [];
      this.selectBoss = [];
      this.IdBZ = "";
      if (Continent.value == 0) this.messageBossZone = "Veuillez sélectionner un Continent.";
      else {
      this.messageBossZone = "Veuillez sélectionner une Zone."
      this.zoneService.getZones().subscribe(response => {     
        response.forEach(item => {
          if (item.ContinentFR == Continent.value) {
            this.selectZone.push(item);
            }
          })
        });
      }
    }
    public changeZone(Zone)
    {
      this.selectBoss = [];
      this.IdBZ = "0";
      if (Zone.value == 0) this.messageBossZone = "Veuillez sélectionner une Zone.";
      else {
      this.bossZoneService.getBossZones().subscribe(response => {
        this.messageBossZone = "Veuillez sélectionner un Boss."
        response.forEach(item => {
          if (item.Zone.Id == Zone.value) {
            this.zoneId = item.Zone.Id;
            this.bossService.getBoss(item.Boss.Id).subscribe(response => {
              this.selectBoss.push(response);
              })
            }
          })
        });
      }
    }
  
    public changeBoss(Boss)
    {
      if (Boss.value == 0) this.messageBossZone = "Veuillez sélectionner un Boss.";
      else {
        this.messageBossZone = "";
        this.bossZoneService.getBossZones().subscribe(response => {
          response.forEach(item => {
            if (Boss.value == item.Boss.Id && this.zoneId == item.Zone.Id) 
            {
              this.Enregistrement.BossZone = new BossZone({});
              this.Enregistrement.BossZone.Id = item.Id;
            }
          });
        });
      }
    }
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
        .subscribe(resp => { });
    }  
    reader.readAsDataURL(file); // Read the file
  }
  
  public upload()
  {
    if(this.appService.data["User"])
    {
      this.Enregistrement.Utilisateur.Id = this.appService.data["User"].Id
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
      //Gérer la suppression des fichiers dans l'inpupt;
      this.UploadOK = "Stratégie bien importée, merci pour votre partage!";
      setTimeout(() => this.UploadOK="",3000)
    }, error => {
      this.UploadFail = "Oops, il semblerait qu'un problème soit survenue (quel webmaster de merde quand même). Veuillez réessayer.";
      setTimeout(() => this.UploadFail="",3000)
    })
    
  }
  
  public changeClasse1(classe)
  {
    this.messageClasse = "";
    this.Idclasse1 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else{
      this.EcritureIdClasse()
    }
  }

  public changeClasse2(classe)
  {
    this.messageClasse = "";
    this.Idclasse2 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else{
      this.EcritureIdClasse()
    }
  }

  public changeClasse3(classe)
  {
    this.messageClasse = "";
    this.Idclasse3 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else {
      this.EcritureIdClasse()
    }
  }

  public changeClasse4(classe)
  {
    this.messageClasse = "";
    this.Idclasse4 = classe.value;
    if(this.Idclasse1 == 0 || this.Idclasse2 == 0 || this.Idclasse3 == 0 || this.Idclasse4 == 0) this.messageClasse = "Veuillez sélectionner les 4 classes.";
    else {
      this.EcritureIdClasse()
    }
  }
  
  public checkImages(T)
  {
    this.Images.splice(0,4); //Vide la liste des 4 images
    for (let file of T.files)
    {
      this.Images.push(file); //Ajout de l'image à la liste des 4 images
    }
    this.errorImage = ""; //Vide le message d'erreur
    if(T.files.length != 4) this.errorImage = "Vous devez sélectionner 4 images."; //Message erreur si nombre de fichier différent de 4.
    else 
    {
      let test: boolean = true;
      for (let file of T.files)
      { //Vérifie que les fichiers sont uniquement des fichiers image de type png, jpeg, jpg.
        if (this.getExtension(file.name) != "png" && this.getExtension(file.name) != "jpeg" && this.getExtension(file.name) != "jpg") test = false;
      }
      if (!test) this.errorImage = "Vos fichiers doivent être uniquement au format JPG, JPEG ou PNG"; //Message erreur si pas image du bon format.
      else { //Vérifications que les 4 fichiers ont le même format.
        if (!(this.getExtension(T.files[0].name) == this.getExtension(T.files[1].name) && this.getExtension(T.files[1].name) == this.getExtension(T.files[2].name) 
            && this.getExtension(T.files[2].name) == this.getExtension(T.files[3].name))) 
            this.errorImage = "Vos 4 fichiers doivent être du même format (JPG, JPEG, PNG)"; 
      }
    }
  }

  public getExtension(path) {
    var basename = path.split(/[\\/]/).pop();  // extract file name from full path ... (supports `\\` and `/` separators)
    let pos = basename.lastIndexOf('.');       // get last position of `.`
    if (basename === '' || pos < 1) return ""; // if file name is empty or ... `.` not found (-1) or comes first (0)
    return basename.slice(pos + 1);            // extract extension ignoring `.`
  }

  //Création chaîne de caractère GUID (enfin presque)
  public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  //Récupération de l'id de chaque classe
  public EcritureIdClasse()
  {
  this.teamService.getTeamByClasses(this.Idclasse1,this.Idclasse2,this.Idclasse3,this.Idclasse4).subscribe(result => {
    this.Enregistrement.Team = new Team({});
    this.Enregistrement.Team.Id = result.Id;
    });
  }
}


  
