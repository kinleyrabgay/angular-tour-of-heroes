import { gql } from 'apollo-angular';

// CREATE HERO
export const CREATE_Hero = gql`
  mutation (
    $name: String!
    $age: Int!
    $clan: String!
    $ability: String!
    $highestXP: String!
  ) {
    createHero(
      name: $name
      age: $age
      clan: $clan
      ability: $ability
      highestXP: $highestXP
    ) {
      id
      name
      age
      clan
      ability
      highestXP
    }
  }
`;

// UPDATE HERO
export const UPDATE_Hero = gql`
  mutation (
    $id: ID!
    $name: String
    $age: Int
    $clan: String
    $ability: String
    $highestXP: String
  ) {
    updateHero(
      id: $id
      name: $name
      age: $age
      clan: $clan
      ability: $ability
      highestXP: $highestXP
    ) {
      id
      name
      age
      clan
      ability
      highestXP
    }
  }
`;

// DELETE HERO
export const DELETE_Hero = gql`
  mutation ($id: ID!) {
    removeHero(id: $id) {
      id
    }
  }
`;
