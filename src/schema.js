const _ = require('lodash');

import { EngineersList } from './data/engineers';
import { ProjectsList } from './data/projects';

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
  description: 'This represents a Fuzz engineer',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLString)},
    name: {type: GraphQLString},
    team: {type: GraphQLString},
    projects: {
      type: new GraphQLList(Project),
      resolve: ({id}) => _.filter(ProjectsList, p => _.includes(p.engineers,id))
    }
  })
});

const Project = new GraphQLObjectType({
  name: 'Project',
  description: 'This represents a Fuzz project',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: GraphQLString},
    engineers: {
      type: new GraphQLList(Engineer),
      resolve: ({engineers}) =>  _.filter(EngineersList, e => _.includes(engineers, e.id))
    }
  })
});

/** Root Query **/
const Query = new GraphQLObjectType({
  name: 'FuzzQL',
  description: 'Root of the GraphQL Schema',
  fields: () => ({
    engineers: {
      type: new GraphQLList(Engineer),
      description: 'List of Fuzz engineers',
      resolve: () => EngineersList
    },
    projects: {
      type: new GraphQLList(Project),
      description: 'List of Fuzz project',
      resolve: () => ProjectsList
    },
    echo: {
      type: GraphQLString,
      description: 'Echo what you enter',
      args: {
        message: {type: GraphQLString}
      },
      resolve: (source, {message}) => `received ${message}`
    }
  })
});

/** Schema **/
const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
