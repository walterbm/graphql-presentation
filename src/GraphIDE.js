import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import Schema from './schema.js';
import 'isomorphic-fetch';

window.ide = require('graphql');

export default class GraphIDE extends Component {
  fetchData({query, variables}) {
    return window.ide.graphql(Schema, query, null, JSON.parse(variables || '{}'));
  }

  render() {
    return (
      <GraphiQL fetcher={this.fetchData} />
    );
  }
}
