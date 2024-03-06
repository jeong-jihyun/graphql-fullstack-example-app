import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../apollo/createApolloServer';
import { verifyAccessToken } from '../utils/jwt-auth';

export const isAuthenticated: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { authorization } = context.req.headers;
  //console.info('authorization >>>', authorization);
  if (!authorization) throw new AuthenticationError('authorization >> unauthenticated');
  const accessToken = authorization.split(' ')[1];
  //console.info(accessToken);
  verifyAccessToken(accessToken);
  //console.log('context >>>', context);
  //console.log('context.verifiedUser >>>', context.verifiedUser);
  if (!context.verifiedUser) throw new AuthenticationError('context.verifiedUser >> unauthenticated');
  return next();
};
