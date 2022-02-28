import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import http from "http";
import typeDefs from "@schema/index";
import resolvers from "@resolvers/index";
import { createConnection } from "typeorm";
import logger from "@logger";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirectiveTransformer } from "@directives/index";
import { graphqlUploadExpress } from "graphql-upload";

dotenv.config();
const app = express();

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express();
  app.use(graphqlUploadExpress());
  const httpServer = http.createServer(app);
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  // schema = deprecatedDirectiveTransformer(schema, "deprecated");
  schema = authDirectiveTransformer(schema);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      authorization: req.headers.authorization,
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          "general.betaUpdates": false,
          "editor.theme": "dark",
          "editor.cursorShape": "line",
          "editor.reuseHeaders": true,
          "tracing.hideTracingResponse": true,
          "queryPlan.hideQueryPlanResponse": true,
          "editor.fontSize": 14,
          "editor.fontFamily": `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          "request.credentials": "omit",
        },
      }),
    ],
  });
  await createConnection();
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  logger.info(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
