import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { RgpdComponent } from './rgpd/rgpd.component';
import { ClasseComponent } from './classe/classe.component';
import { SkillsComponent } from './skills/skills.component';
import { JouetsComponent } from './jouets/jouets.component';
import { ListBossComponent } from './list-boss/list-boss.component';
import { MesPreferencesComponent } from './mes-preferences/mes-preferences.component';
import { ChangerPasswordComponent } from './changer-password/changer-password.component';
import { MesInfosComponent } from './mes-infos/mes-infos.component';
import { AddStrategieComponent } from './add-strategie/add-strategie.component';
import { SearchStrategieComponent } from './search-strategie/search-strategie.component';
import { FavStrategieComponent } from './fav-strategie/fav-strategie.component';
import { MesStrategieComponent } from './mes-strategie/mes-strategie.component';
import { InscriptionComponent } from './inscription/inscription.component'
import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule} from 'angular-webstorage-service';
import { MonJeton } from 'src/assets/services/Jeton';
import { ActivationComponent } from './activation/activation.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    RgpdComponent,
    ClasseComponent,
    SkillsComponent,
    JouetsComponent,
    ListBossComponent,
    MesPreferencesComponent,
    ChangerPasswordComponent,
    MesInfosComponent,
    AddStrategieComponent,
    SearchStrategieComponent,
    FavStrategieComponent,
    MesStrategieComponent,
    InscriptionComponent,
    ActivationComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    StorageServiceModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
