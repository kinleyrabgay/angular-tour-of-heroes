import { gql } from 'apollo-angular';

// GET all HERO
export const GET_Heroes = gql`
  query {
    allHeros {
      id
      name
      age
      clan
      ability
      highestXP
    }
  }
`;

// GET HERO by ID
export const Heros_ById = gql`
  query ($heroFilter: HeroFilter) {
    allHeros(filter: $heroFilter) {
      id
      name
      age
      clan
      ability
      highestXP
    }
  }
`;
