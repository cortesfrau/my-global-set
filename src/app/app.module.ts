import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardSearchFormComponent } from './components/card-search-form/card-search-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CardPrintListComponent } from './components/card-print-list/card-print-list.component';
import { CardPrintComponent } from './components/card-print/card-print.component';

@NgModule({
  declarations: [
    AppComponent,
    CardSearchFormComponent,
    CardPrintListComponent,
    CardPrintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
