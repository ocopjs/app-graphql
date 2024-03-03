const express = require("express");
const { graphqlUploadExpress } = require("graphql-upload");
const { GraphQLPlaygroundApp } = require("@ocopjs/app-graphql-playground");
const validation = require("./validation");

class GraphQLApp {
  constructor({
    apiPath = "/admin/api",
    graphiqlPath = "/admin/graphiql",
    schemaName = "public",
    apollo = {},
  } = {}) {
    if (schemaName === "internal") {
      throw new Error(
        "The schemaName 'internal' is a reserved name cannot be used in a GraphQLApp."
      );
    }

    this._apiPath = apiPath;
    this._graphiqlPath = graphiqlPath;
    this.apolloConfig = apollo;
    this._schemaName = schemaName;
  }

  /**
   * @return Array<middlewares>
   */
  getMiddleware({ ocop, dev }) {
    const server = ocop.createApolloServer({
      apolloConfig: this.apolloConfig,
      schemaName: this._schemaName,
      dev,
    });
    const apiPath = this._apiPath;
    const graphiqlPath = this._graphiqlPath;
    const app = express();

    if (dev && graphiqlPath) {
      // This is a convenience to make the out of the box experience slightly simpler.
      // We should reconsider support for this at some point in the future. -TL
      app.use(
        new GraphQLPlaygroundApp({ apiPath, graphiqlPath }).getMiddleware({
          ocop,
          dev,
        })
      );
    }

    const maxFileSize =
      (this.apolloConfig && this.apolloConfig.maxFileSize) || 200 * 1024 * 1024;
    const maxFiles = (this.apolloConfig && this.apolloConfig.maxFileSize) || 5;
    app.use(graphqlUploadExpress({ maxFileSize, maxFiles }));
    // { cors: false } - prevent ApolloServer from overriding ocop's CORS configuration.
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#ApolloServer-applyMiddleware
    app.use(server.getMiddleware({ path: apiPath, cors: false }));
    return app;
  }

  /**
   * @param Options { distDir }
   */
  build() {}
}

module.exports = {
  GraphQLApp,
  validation,
};
