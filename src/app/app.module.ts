import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StorageServiceModule } from 'angular-webstorage-service';
import { ModalModule } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as C from './components';
import * as S from './services';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    C.HomeComponent,
    C.ContactComponent,
    C.RgpdComponent,
    C.ClasseComponent,
    C.SkillsComponent,
    C.JouetsComponent,
    C.ListBossComponent,
    C.MesPreferencesComponent,
    C.ChangerPasswordComponent,
    C.MesInfosComponent,
    C.AddStrategieComponent,
    C.SearchStrategieComponent,
    C.InscriptionComponent,
    C.ActivationComponent,
    C.RetrievePasswordComponent,
    C. AdminUsersComponent,
    C.AdminStratComponent,
    C.TestComponent,
    C.PaginatorComponent
  ],
  exports: [TranslateModule],
  imports: [
    HttpClientModule,
    BrowserModule,
    StorageServiceModule,
    AppRoutingModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient],
      },
    })
  ],
  providers: [S.IsAnonyme, S.IsToActivate, S.IsUser, S.IsAdmin, S.AccessService],
  bootstrap: [AppComponent]
})
export class AppModule { }



