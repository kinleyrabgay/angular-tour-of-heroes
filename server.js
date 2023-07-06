const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const axios = require("axios");

const app = express();
const port = 4000;

// GraphQL schema
const typeDefs = gql`
  type Hero {
    id: ID!
    name: String!
    age: Int!
    clan: String!
    ability: String!
    highestXP: String!
  }

  type Query {
    heroes: [Hero]
    hero(id: ID!): Hero
  }

  type Mutation {
    addHero(hero: HeroInput!): Hero
    updateHero(hero: HeroInput!): Hero
    deleteHero(id: ID!): Hero
  }

  input HeroInput {
    id: ID
    name: String!
    age: Int!
    clan: String!
    ability: String!
    highestXP: String!
  }
`;

// JSON Server endpoint
const jsonServerUrl = "http://localhost:3000/heroes";

// GraphQL resolvers
const resolvers = {
  Query: {
    heroes: async () => {
      const response = await axios.get(jsonServerUrl);
      return response.data;
    },
    hero: async (_, { id }) => {
      const response = await axios.get(`${jsonServerUrl}/${id}`);
      return response.data;
    },
  },
  Mutation: {
    addHero: async (_, { hero }) => {
      const response = await axios.post(jsonServerUrl, hero);
      return response.data;
    },
    updateHero: async (_, { hero }) => {
      const response = await axios.put(`${jsonServerUrl}/${hero.id}`, hero);
      return response.data;
    },
    deleteHero: async (_, { id }) => {
      const response = await axios.delete(`${jsonServerUrl}/${id}`);
      return response.data;
    },
  },
};

// Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Start the server
  app.listen(port, () => {
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    );
  });
}

startServer();
