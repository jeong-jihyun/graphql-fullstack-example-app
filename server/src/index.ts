import 'reflect-metadata';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import http from 'http';
import { buildSchema } from 'type-graphql';
import { FilmResolver } from './resolvers/Film';
import { CutResolver } from './resolvers/Cut';

async function main() {
  const app = express();

  const apolloServer = new ApolloServer({
    // typeDefs: gql`
    //     type Query {
    //         hello: String
    //     }
    // `,
    // resolvers: {
    //     Query: {
    //         hello: () => `Hello world!!!!`,
    //     },
    // },
    schema: await buildSchema({
      // 책에서는 CutResolver를 추가하는 내용이 빠져있는 상태로 확인
      resolvers: [FilmResolver, CutResolver],
    }),
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  httpServer.listen(process.env.PORT || 4000, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`
                server started on => http://localhost:4000
                graphql playground => http://localhost:4000/graphql
            `);
    } else {
      console.log(`
            Production server Stateed...
        `);
    }
  });
}

main().catch((err) => console.log(err));
