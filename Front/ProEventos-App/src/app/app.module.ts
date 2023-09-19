// ANGULAR IMPORTS
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// APP'S IMPORTS
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// NGX IMPORTS
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';

// SHARED'S IMPORTS
import { NavComponent } from './shared/nav/nav.component';
import { TitleComponent } from './shared/title/title.component';

// COMPONENT'S IMPORTS
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';
import { EventoDetalhesComponent } from './components/eventos/evento-detalhes/evento-detalhes.component';

// HELPER IMPORT
import { DateFormatPipe } from './helpers/DateFormat.pipe';

// SERVICES IMPORTS
import { LoteService } from './service/lote.service';
import { EventoService } from './service/evento.service';
import { AccountService } from './service/account.service';

// INTERCEPTOR IMPORT
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { HomeComponent } from './components/home/home.component';

defineLocale('pt-br', ptBrLocale);


@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    EventoDetalhesComponent,
    EventoListaComponent,
    ContatosComponent,
    UserComponent,
    PerfilComponent,
    PalestrantesComponent,
    RegistrationComponent,
    LoginComponent,
    NavComponent,
    DashboardComponent,
    HomeComponent,
    TitleComponent,
    DateFormatPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true
    }),
    NgxSpinnerModule.forRoot({
       type: 'pacman'
       })
  ],
  providers: [
    EventoService,
    LoteService,
    AccountService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
})
export class AppModule { 
  constructor() {
    registerLocaleData('localePtBr');
  }

}


