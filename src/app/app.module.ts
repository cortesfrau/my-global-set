import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardSearchFormComponent } from './components/card/card-search-form/card-search-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CardPrintListComponent } from './components/card/card-print-list/card-print-list.component';
import { CardPrintComponent } from './components/card/card-print/card-print.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { CollectionListComponent } from './components/collection/collection-list/collection-list.component';
import { CollectionItemComponent } from './components/collection/collection-item/collection-item.component';
import { CollectionDetailComponent } from './components/collection/collection-detail/collection-detail.component';
import { FormSpinnerComponent } from './components/form-spinner/form-spinner.component';
import { PageHeaderComponent } from './components/page/page-header/page-header.component';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { InfoCollapseComponent } from './components/info-collapse/info-collapse.component';

@NgModule({
    declarations: [
        AppComponent,
        CardSearchFormComponent,
        CardPrintListComponent,
        CardPrintComponent,
        LoaderComponent,
        NavbarComponent,
        FooterComponent,
        LoginComponent,
        ProfileComponent,
        RequestResetComponent,
        ResponseResetComponent,
        HomeComponent,
        SignupComponent,
        CollectionListComponent,
        CollectionItemComponent,
        CollectionDetailComponent,
        FormSpinnerComponent,
        PageHeaderComponent
    ],
    providers: [{
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule,
        InfoCollapseComponent
    ]
})
export class AppModule { }
