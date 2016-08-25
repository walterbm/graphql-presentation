import { EngineersList } from './data/engineers';

import {
  // basic GraphQL types
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLEnumType,

  // Used to create required fields and arguments
  GraphQLNonNull,

  // Class that creates the Schema
  GraphQLSchema
} from 'graphql';

const Engineer = new GraphQLObjectType({
  name: 'Engineer',
  description: 'This represent a Fuzz engineer',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: GraphQLString},
    team: {type: GraphQLString}
  })
});

/** Root Query **/
const Query = new GraphQLObjectType({
  name: 'FuzzQL',
  description: 'Root of the GraphQL Schema',
  fields: () => ({
    engineers: {
      type: new GraphQLList(Engineer),
      resolve: () => {
        return EngineersList;
      }
    },
    echo: {
      type: GraphQLString,
      description: 'Echo what you enter',
      description: 'List of Fuzz engineers',
      args: {
        message: {type: GraphQLString}
      },
      resolve: (source, {message}) => {
        return `received ${message}`;
      }
    }
  })
});

/** Schema **/
const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
