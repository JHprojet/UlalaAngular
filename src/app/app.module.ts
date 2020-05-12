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
import { InscriptionComponent } from './inscription/inscription.component'
import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule} from 'angular-webstorage-service';
import { ActivationComponent } from './activation/activation.component';
import { RetrievePasswordComponent } from './retrieve-password/retrieve-password.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminStratComponent } from './admin-strat/admin-strat.component';
import { ModalModule } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { AccessComponent } from './helpeur/access-component';
import { TestComponent } from './test/test.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IsAdmin } from './helpeur/is-admin';
import { IsUser } from './helpeur/is-user';
import { IsToActivate } from './helpeur/is-to-activate';
import { IsAnonyme } from './helpeur/is-anonyme';

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
    InscriptionComponent,
    ActivationComponent,
    RetrievePasswordComponent,
    AdminUsersComponent,
    AdminStratComponent,
    TestComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    StorageServiceModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [IsAnonyme,IsToActivate,IsUser,IsAdmin,AccessComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }



