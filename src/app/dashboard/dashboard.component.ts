import { Component, OnInit } from '@angular/core';
import { Hero } from '../gql/hero/hero';
import { CrudService } from '../api/crud.service';
import { Apollo } from 'apollo-angular';
import { GET_Heroes } from '../gql/hero-query';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private crudService: CrudService, private apollo: Apollo) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_Heroes, // Use the GET_Heroes query
      })
      .valueChanges.subscribe(({ data }) => {
        this.heroes = data.allHeros.slice(1, 5); // Update the heroes array
      });
  }
}
