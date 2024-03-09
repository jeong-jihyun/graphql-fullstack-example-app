import { GraphQLSchema } from 'graphql';
import { FilmResolver } from '../resolvers/Film';
import { CutResolver } from '../resolvers/Cut';
import { UserResolver } from '../resolvers/User';
import { CutReviewResolver } from '../resolvers/CutReview';
import { buildSchema } from 'type-graphql';
import { PubSub } from 'graphql-subscriptions';
import { NotificationResolver } from '../resolvers/Notification';

export const createSchema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    // 책에서는 CutResolver를 추가하는 내용이 빠져있는 상태로 확인
    // NotificationResolver 추가
    resolvers: [FilmResolver, CutResolver, UserResolver, CutReviewResolver, NotificationResolver],
    pubSub: new PubSub(),
  });
};
