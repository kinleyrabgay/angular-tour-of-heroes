import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../model/hero';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'http://localhost:3000/heroes';
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.apiURL, hero);
  }

  getAllHero(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiURL);
  }

  deleteHerok(hero: Hero): Observable<Hero> {
    return this.http.delete<Hero>(this.apiURL + '/' + hero.id);
  }

  deleteHero(id: number): Observable<Hero> {
    return this.http.delete<Hero>(`${this.apiURL}/${id}`);
  }

  editHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(this.apiURL + '/' + hero.id, hero);
  }
}
