import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import 'reflect-metadata';
import createApolloServer from './apollo/createApolloServer';
import { AppDataSource } from './db/db-client';
import { createSchema } from './apollo/createSchema';
import dotenv from 'dotenv';
//import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
// const {
//   GraphQLUpload,
//   graphqlUploadExpress, // A Koa implementation is also exported.
// } = require('graphql-upload');

dotenv.config();
async function main() {
  //console.log(__dirname + '\\' + '.env');
  //console.log(process.env);
  console.log('process.env.DB_HOST', process.env.DB_HOST);
  const app = express();
  // 쿠키 파서 설정
  app.use(cookieParser());
  // app.use(graphqlUploadExpress({ maxFileSize: 1024 * 1000 * 5, maxFiles: 1 }));
  app.use(express.static('public'));

  await AppDataSource.initialize();
  const schema = await createSchema();

  const httpServer = http.createServer(app);
  const apolloServer = await createApolloServer(schema, httpServer);
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

  // const httpServer = http.createServer(app);

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
