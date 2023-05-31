import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { CrudService } from '../api/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.crudService
      .getAllHero()
      .subscribe((heroes) => (this.heroes = heroes.slice(1, 5)));
  }
}
