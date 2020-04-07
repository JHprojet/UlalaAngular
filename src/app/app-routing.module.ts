import { NgModule } from '@angular/core';
import { Router, Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { RgpdComponent } from './rgpd/rgpd.component';
import { JouetsComponent } from './jouets/jouets.component';
import { SkillsComponent } from './skills/skills.component';
import { ClasseComponent } from './classe/classe.component';
import { ListBossComponent } from './list-boss/list-boss.component';
import { MesInfosComponent } from './mes-infos/mes-infos.component';
import { ChangerPasswordComponent } from './changer-password/changer-password.component';
import { MesPreferencesComponent } from './mes-preferences/mes-preferences.component';
import { MesStrategieComponent } from './mes-strategie/mes-strategie.component';
import { AddStrategieComponent } from './add-strategie/add-strategie.component';
import { SearchStrategieComponent } from './search-strategie/search-strategie.component';
import { FavStrategieComponent } from './fav-strategie/fav-strategie.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ActivationComponent } from './activation/activation.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path : 'home', component: HomeComponent},
    {path : 'contact', component: ContactComponent},
    {path : 'rgpd', component: RgpdComponent},
    {path : 'classes', component: ClasseComponent},
    {path : 'skills', component: SkillsComponent},
    {path : 'toys', component: JouetsComponent},
    {path : 'listboss', component: ListBossComponent},
    {path : 'prefs', component: MesPreferencesComponent},
    {path : 'pass', component: ChangerPasswordComponent},
    {path : 'myinfos', component: MesInfosComponent},
    {path : 'mystrat', component: MesStrategieComponent},
    {path : 'addstrat', component: AddStrategieComponent},
    {path : 'searchstrat', component: SearchStrategieComponent},
    {path : 'favstrat', component: FavStrategieComponent},
    {path : 'inscription', component: InscriptionComponent},
    {path : 'activation', component: ActivationComponent}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
