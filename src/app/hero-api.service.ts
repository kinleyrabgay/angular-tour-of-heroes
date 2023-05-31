import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroApiService {
  // end-point
  private apiUrl = 'http://localhost:3000/heroes';

  // Inject
  constructor(private http: HttpClient) {}

  // getHeroes
  getHeroes() {
    return this.http.get(this.apiUrl);
  }

  // getHeroes:ID
  getHeroById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // addHero
  addHero(hero: any) {
    return this.http.post(`${this.apiUrl}/${hero.id}`, hero);
  }

  // updateHero
  updateHero(hero: any) {
    return this.http.put(this.apiUrl, hero);
  }

  // deleteHero
  deleteHero(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
