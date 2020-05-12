import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { AddStrategieComponent } from './add-strategie/add-strategie.component';
import { SearchStrategieComponent } from './search-strategie/search-strategie.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ActivationComponent } from './activation/activation.component';
import { RetrievePasswordComponent } from './retrieve-password/retrieve-password.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminStratComponent } from './admin-strat/admin-strat.component';
import { TestComponent } from './test/test.component';
import { IsAdmin } from './helpeur/is-admin';
import { IsUser } from './helpeur/is-user';
import { IsToActivate } from './helpeur/is-to-activate';
import { IsAnonyme } from './helpeur/is-anonyme';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    {path : '', component: HomeComponent},
    {path : 'contact', component: ContactComponent, canActivate: [IsAnonyme]},
    {path : 'rgpd', component: RgpdComponent, canActivate: [IsAnonyme]},
    {path : 'classes', component: ClasseComponent, canActivate: [IsAnonyme]},
    {path : 'skills', component: SkillsComponent, canActivate: [IsAnonyme]},
    {path : 'toys', component: JouetsComponent, canActivate: [IsAnonyme]},
    {path : 'listboss', component: ListBossComponent, canActivate: [IsAnonyme]},
    {path : 'prefs', component: MesPreferencesComponent, canActivate: [IsUser]},
    {path : 'pass', component: ChangerPasswordComponent, canActivate: [IsUser]},
    {path : 'myinfos', component: MesInfosComponent, canActivate: [IsUser]},
    {path : 'mystrat', component: SearchStrategieComponent, canActivate: [IsAnonyme]},
    {path : 'addstrat', component: AddStrategieComponent, canActivate: [IsAnonyme]},
    {path : 'searchstrat', component: SearchStrategieComponent, canActivate: [IsAnonyme]},
    {path : 'favstrat', component: SearchStrategieComponent, canActivate: [IsAnonyme]},
    {path : 'inscription', component: InscriptionComponent, canActivate: [IsAnonyme]},
    {path : 'activation', component: ActivationComponent, canActivate: [IsToActivate]},
    {path : 'RetrievePassword', component: RetrievePasswordComponent, canActivate: [IsUser]},
    {path : 'admusers', component: AdminUsersComponent, canActivate: [IsAdmin]},
    {path : 'admstrats', component: AdminStratComponent, canActivate: [IsAdmin]},
    {path : 'test', component: TestComponent, canActivate: [IsAnonyme]}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
