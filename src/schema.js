// import PostsList from './data/posts';
// import AuthorsList from './data/authors';
// import {CommentList, ReplyList} from './data/comments';

import {
  // These are the basic GraphQL types
  // GraphQLInt,
  // GraphQLFloat,
  GraphQLString,
  // GraphQLList,
  GraphQLObjectType,
  // GraphQLEnumType,

  // This is used to create required fields and arguments
  // GraphQLNonNull,

  // This is the class we need to create the schema
  GraphQLSchema
} from 'graphql';

// This is the Root Query
const Query = new GraphQLObjectType({
  name: 'FuzzQL',
  description: 'Root of the GraphQL Schema',
  fields: () => ({
    echo: {
      type: GraphQLString,
      description: 'Echo what you enter',
      args: {
        message: {type: GraphQLString}
      },
      resolve: function(source, {message}) {
        return `received ${message}`;
      }
    }
  })
});

// The Schema
const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
