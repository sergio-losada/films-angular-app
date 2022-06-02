import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Film } from '../dto/Film';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private url = environment.API_URL + "/server/Films";
  private headers: HttpHeaders;

  constructor(private http:HttpClient) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('content-type', 'application/json');
  }

  public getFilms(): Observable<HttpResponse<Film[]>> {
    return this.http.get<Film[]>(this.url, { 'headers': this.headers, observe: 'response' });
  }

  public getFilm(name: string): Observable<HttpResponse<Film>> {
    return this.http.get<Film>(this.url + "/" + name, { 'headers': this.headers, observe: 'response' });
  }

  public postFilm(body: any): Observable<HttpResponse<Film>> {
    return this.http.post<Film>(this.url, body, { observe: 'response', 'headers': this.headers });
  }

  public putFilm(key: any, body: any): Observable<HttpResponse<Film>> {
    return this.http.put<Film>(this.url +  "/" + key, body, { observe: 'response', 'headers': this.headers });
  }

  public deleteFilm(key: any): Observable<HttpResponse<void>> {
    return this.http.delete<void>(this.url + "/" + key, { observe: 'response', 'headers': this.headers });
  }
  
}
