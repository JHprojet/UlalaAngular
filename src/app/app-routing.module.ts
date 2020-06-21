import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { RgpdComponent } from './components/rgpd/rgpd.component';
import { JouetsComponent } from './components/jouets/jouets.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ClasseComponent } from './components/classe/classe.component';
import { ListBossComponent } from './components/list-boss/list-boss.component';
import { MesInfosComponent } from './components/mes-infos/mes-infos.component';
import { ChangerPasswordComponent } from './components/changer-password/changer-password.component';
import { MesPreferencesComponent } from './components/mes-preferences/mes-preferences.component';
import { AddStrategieComponent } from './components/add-strategie/add-strategie.component';
import { SearchStrategiesComponent } from './components/search-strategie/search-strategie.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { ActivationComponent } from './components/activation/activation.component';
import { RetrievePasswordComponent } from './components/retrieve-password/retrieve-password.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminStratComponent } from './components/admin-strat/admin-strat.component';
import { TestComponent } from './components/test/test.component';
import { IsAdmin } from './services/is-admin';
import { IsUser } from './services/is-user';
import { IsToActivate } from './services/is-to-activate';
import { IsAnonyme } from './services/is-anonyme';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path : '', component: HomeComponent, canActivate: [IsAnonyme]},
    {path : 'contact', component: ContactComponent, canActivate: [IsAnonyme]},
    {path : 'rgpd', component: RgpdComponent, canActivate: [IsAnonyme]},
    {path : 'classes', component: ClasseComponent, canActivate: [IsAnonyme]},
    {path : 'skills', component: SkillsComponent, canActivate: [IsAnonyme]},
    {path : 'toys', component: JouetsComponent, canActivate: [IsAnonyme]},
    {path : 'listboss', component: ListBossComponent, canActivate: [IsAnonyme]},
    {path : 'prefs', component: MesPreferencesComponent, canActivate: [IsUser]},
    {path : 'pass', component: ChangerPasswordComponent, canActivate: [IsUser]},
    {path : 'myinfos', component: MesInfosComponent, canActivate: [IsUser]},
    {path : 'mystrat', component: SearchStrategiesComponent, canActivate: [IsAnonyme]},
    {path : 'addstrat', component: AddStrategieComponent, canActivate: [IsAnonyme]},
    {path : 'searchstrat', component: SearchStrategiesComponent, canActivate: [IsAnonyme]},
    {path : 'favstrat', component: SearchStrategiesComponent, canActivate: [IsAnonyme]},
    {path : 'inscription', component: InscriptionComponent, canActivate: [IsAnonyme]},
    {path : 'activation', component: ActivationComponent, canActivate: [IsToActivate]},
    {path : 'RetrievePassword', component: RetrievePasswordComponent, canActivate: [IsAnonyme]},
    {path : 'admusers', component: AdminUsersComponent, canActivate: [IsAdmin]},
    {path : 'admstrats', component: AdminStratComponent, canActivate: [IsAdmin]},
    {path : 'test', component: TestComponent, canActivate: [IsAnonyme]}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
