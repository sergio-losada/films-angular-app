import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Film } from '../dto/Film';
import { FilmService } from '../service/film.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit {

  films: Film[];
  constructor(private filmService: FilmService) { 
    this.films = [];
  }

  ngOnInit(): void {
    this.filmService.getFilms().subscribe((data: HttpResponse<Film[]>) => {
      this.films = data.body!.sort((film1: Film, film2: Film) => {
        return film1.title.toLowerCase().localeCompare(film2.title.toLowerCase());
      });
    });
  }

}
