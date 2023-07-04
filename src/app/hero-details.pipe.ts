import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from './model/hero'; // Assuming you have a Hero interface or class

@Pipe({
  name: 'heroDetails',
})
export class HeroDetailsPipe implements PipeTransform {
  transform(hero: Hero): string {
    // Format the hero details according to your requirements
    return `Name: ${hero.name}, Age: ${hero.age}, Clan: ${hero.clan}, Ability: ${hero.ability}, Highest XP: ${hero.highestXP}`;
  }
}
