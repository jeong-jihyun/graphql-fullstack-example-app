import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import http from 'http';
import { createCutVoteLoader } from '../dataloaders/cutVoteLoader';
import redis from '../redis/redis-client';
import { JwtVerifiedUser, verifyAccessTokenFromRequestHeaders } from '../utils/jwt-auth';
// express context에 할당
// redis add
export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUser;
  redis: typeof redis;
  // 유틸리티 타입을 사용해 cutVoteLoader의 반환값 구성
  cutVoteLoader: ReturnType<typeof createCutVoteLoader>;
}

// ApolloServer에 설정 반영
const createApolloServer = async (schema: GraphQLSchema, server: http.Server): Promise<ApolloServer> => {
  return new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // 서버측에서 엑세스 토큰이 포함된 요청을 받은 뒤 엑세스 토큰을 해제하여 어느 유저로 부터
    // 요청인지, 토큰이 만료되었는지 등을 파악
    context: ({ req, res }) => {
      // 엑세스 토큰 검증
      const verified = verifyAccessTokenFromRequestHeaders(req.headers);
      return {
        req,
        res,
        verifiedUser: verified,
        redis,
        cutVoteLoader: createCutVoteLoader(),
      };
    },
  });
};

export default createApolloServer;
