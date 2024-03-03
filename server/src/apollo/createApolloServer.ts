import { ApolloServerPluginLandingPageLocalDefault, AuthenticationError } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { buildSchema } from 'type-graphql';
import { CutResolver } from '../resolvers/Cut';
import { FilmResolver } from '../resolvers/Film';
import { UserResolver } from '../resolvers/User';
import { DEFAULT_SECRET_KEY, JwtVerifiedUser, verifyAccessTokenFromRequestHeaders } from '../utils/jwt-auth';
// express context에 할당
export interface MyContext {
  req: Request;
  res: Response;
  verifiedUser: JwtVerifiedUser;
}

// 엑세스 토큰 검증
export const verifyAccessToken = (accessToken?: string): JwtVerifiedUser | null => {
  if (!accessToken) return null;
  try {
    const verified = jwt.verify(accessToken, process.env.JWT_SECRET_KEY || DEFAULT_SECRET_KEY) as JwtVerifiedUser;
    return verified;
  } catch {
    throw new AuthenticationError('access token expired');
  }
};

// ApolloServer에 설정 반영
const createApolloServer = async (): Promise<ApolloServer> => {
  return new ApolloServer<MyContext>({
    schema: await buildSchema({
      // 책에서는 CutResolver를 추가하는 내용이 빠져있는 상태로 확인
      resolvers: [FilmResolver, CutResolver, UserResolver],
    }),
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // 서버측에서 엑세스 토큰이 포함된 요청을 받은 뒤 엑세스 토큰을 해제하여 어느 유저로 부터
    // 요청인지, 토큰이 만료되었는지 등을 파악
    context: ({ req, res }) => {
      // 엑세스 토큰 검증
      const verified = verifyAccessTokenFromRequestHeaders(req.headers);
      return { req, res, verifiedUser: verified };
    },
  });
};

export default createApolloServer;
