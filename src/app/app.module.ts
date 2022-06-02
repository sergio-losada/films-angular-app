import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FilmService } from './service/film.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DataViewModule } from "primeng/dataview";
import { DropdownModule } from 'primeng/dropdown';
import { FilmsComponent } from './films/films.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { AddFilmComponent } from './add-film/add-film.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FilmsComponent,
    FilmDetailComponent,
    AddFilmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    DataViewModule
  ],
  providers: [FilmService],
  bootstrap: [AppComponent]
})
export class AppModule { }
