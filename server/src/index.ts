import express from 'express';
import http from 'http';
import 'reflect-metadata';
import createApolloServer from './apollo/createApolloServer';
import { AppDataSource } from './db/db-client';

async function main() {
  const app = express();
  //console.log(__dirname);
  await AppDataSource.initialize();

  const apolloServer = await createApolloServer();
  // await 삽입하지 않아서 에러원인을 찾지 못하는 현상이 발생함.
  await apolloServer.start();
  // 아폴로 스튜디오를 허용하도록 설정
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

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
