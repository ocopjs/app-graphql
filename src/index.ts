import express from "express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
// @ts-ignore
//import { GraphQLPlaygroundApp } from "@ocopjs/app-graphql-playground";
import { expressMiddleware } from "@as-integrations/express5";
import * as validation from "./validation";

export { validation };
export class GraphQLApp {
  _apiPath: string;
  _graphiqlPath: string;
  _schemaName: any;
  apolloConfig: any;
  constructor({
    apiPath = "/admin/api",
    graphiqlPath = "/admin/graphiql",
    schemaName = "public",
    apollo = {},
  } = {}) {
    if (schemaName === "internal") {
      throw new Error(
        "The schemaName 'internal' is a reserved name cannot be used in a GraphQLApp.",
      );
    }

    this._apiPath = apiPath;
    this._graphiqlPath = graphiqlPath;
    this.apolloConfig = apollo;
    this._schemaName = schemaName;
  }

  async getMiddleware({ ocop, dev }: any) {
    const server = ocop.createApolloServer({
      apolloConfig: this.apolloConfig,
      schemaName: this._schemaName,
      dev,
    });
    await server.start();
    const apiPath = this._apiPath;
    const graphiqlPath = this._graphiqlPath;
    const app = express();

    //if (dev && graphiqlPath) {
    //  app.use(
    //    new GraphQLPlaygroundApp({ apiPath, graphiqlPath }).getMiddleware({
    //      ocop,
    //      dev,
    //    }),
    //  ) as any;
    //}

    const maxFileSize =
      (this.apolloConfig && this.apolloConfig.maxFileSize) || 200 * 1024 * 1024;
    const maxFiles = (this.apolloConfig && this.apolloConfig.maxFileSize) || 5;
    app.use(graphqlUploadExpress({ maxFileSize, maxFiles }) as any);
    // { cors: false } - prevent ApolloServer from overriding ocop's CORS configuration.
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#ApolloServer-applyMiddleware
    //app.use(server.getMiddleware({ path: apiPath, cors: false }));
    app.use(
      express.json(),
      expressMiddleware(server, { context: server._context }) as any,
    );

    return app as any;
  }

  /**
   * @param Options { distDir }
   */
  build() {}
}
