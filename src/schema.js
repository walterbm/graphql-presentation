import * as _ from 'lodash';

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
  GraphQLInputObjectType,

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
      description: 'List of Fuzz projects',
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
const Mutation = new GraphQLObjectType({
  name: "FuzzMutations",
  fields: {
    createProject: {
      type: Project,
      description: "Create a new project",
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        engineers: {type: new GraphQLList(GraphQLString)}
      },
      resolve: (source, {...project}) => {
        if(_.find(ProjectsList, p => p.title == project.title)) {
          throw new Error("Project already exists: " + project.title);
        }
        ProjectsList.push(project);
        return project;
      }
    },
    createEngineer: {
      type: Engineer,
      description: "Add a new engineer",
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        team: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: (source, {...engineer}) => {
        if(_.find(EngineersList, e => e.id == engineer.id)) {
          throw new Error("Engineer already exists: " + engineer.id);
        }
        ProjectsList.push(engineer);
        return engineer;
      }
    },
    updateResourcing: {
      type: Project,
      description: "Update resourcing on a specific project",
      args: {
        projectId: {type: new GraphQLNonNull(GraphQLString)},
        add: {type: new GraphQLList(GraphQLString)},
        remove: {type: new GraphQLList(GraphQLString)}
      },
      resolve: (source, {...resourcing}) => {
        let index = _.findIndex(ProjectsList, p => p.id == resourcing.projectId);
        if(index != -1) {
          ProjectsList[index].engineers = _.union(_.difference(ProjectsList[index].engineers, resourcing.remove), resourcing.add)
        } else {
          throw new Error(`A Project with ID # ${resourcing.projectId} does not exists!`);
        }
        return ProjectsList[index];
      }
    }
  }
});

/** Schema **/
const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
