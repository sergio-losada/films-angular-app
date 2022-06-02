import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Film } from '../dto/Film';
import { FilmService } from '../service/film.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  formSearch!: FormGroup;
  films: Film[] = [];
  public filmName: string = "name";
  selectedFilm!: Film;

  constructor(private router: Router, private filmService: FilmService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.filmService.getFilms().subscribe((data: HttpResponse<Film[]>) => {
        data.body?.forEach(api => {
          this.films.push(api);
        })  
    })
    this.formSearch = this.formBuilder.group({
      filmName: ['', Validators.required],
    });
  }

  async search(filmName: string) {
    var film = "";
    if(filmName === "") {
      if (typeof this.formSearch.value.filmName === "string") {
        // Manual typed with keyboard
        film = this.formSearch.value.filmName
      }
      else {
        // Selected with arrows and enter key
        film = this.formSearch.value.filmName.name;
      }
    }
    else {
      // Triggered by click in the suggestions list
      film = filmName;
    }
    try {
      film = film.replace("<b>", "").replace("</b>", "");
      const responseApi: HttpResponse<Film> | undefined = await this.filmService.getFilm(film).toPromise()
      this.selectedFilm = responseApi?.body!;
      this.router.navigate([this.selectedFilm.title])
      .then(() => {
          window.location.reload();
      });
    }
    catch (error) {
      await this.router.navigate(['']);
    }
  }

}
