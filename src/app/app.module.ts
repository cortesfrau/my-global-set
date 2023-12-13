import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardSearchFormComponent } from './components/card/card-search-form/card-search-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CardPrintListComponent } from './components/card/card-print-list/card-print-list.component';
import { CardPrintComponent } from './components/card/card-print/card-print.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationBlockComponent } from './components/notification-block/notification-block.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-alt-snotify';

@NgModule({
  declarations: [
    AppComponent,
    CardSearchFormComponent,
    CardPrintListComponent,
    CardPrintComponent,
    LoaderComponent,
    NavbarComponent,
    FooterComponent,
    NotificationBlockComponent,
    LoginComponent,
    ProfileComponent,
    RequestResetComponent,
    ResponseResetComponent,
    HomeComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    SnotifyModule
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
