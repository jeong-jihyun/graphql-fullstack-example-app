import { isAuthenticated } from '../middlewares/isAuthenticated';
import Notification from '../entities/Notification';
import { MySubscriptionContext } from '../apollo/createSubscriptionServer';

import {
  Arg,
  Ctx,
  Int,
  Mutation,
  PubSub,
  Publisher,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';
import { MyContext } from '../apollo/createApolloServer';

@Resolver(Notification)
export class NotificationResolver {
  /**
   * 알림 Subscription
   * @param notificationPayload
   * @returns
   */
  @Subscription({
    topics: 'NOTIFICATION_CREATED',
    // 자기 자신에게 온 알림이 생성되었을 때만 실행되어야 함.
    filter: ({ payload, context }: ResolverFilterData<Notification, null, MySubscriptionContext>) => {
      const { verifiedUser } = context;
      if (verifiedUser && payload && payload.userId === verifiedUser.userId) {
        return true;
      }
      return false;
    },
  })
  newNotification(@Root() notificationPayload: Notification): Notification {
    return notificationPayload;
  }
  /**
   * 알림 저장 처리
   * @param userId
   * @param text
   * @returns
   */
  @UseMiddleware(isAuthenticated)
  @Mutation(() => Notification)
  async createNotification(
    @Arg('userId', () => Int) userId: number,
    @Arg('text') text: string,
    @PubSub('NOTIFICATION_CREATED') publish: Publisher<Notification>,
  ): Promise<Notification> {
    const newNoti = await Notification.create({ text, userId }).save();
    // 알림 생성 이벤트 발행
    await publish(newNoti);
    return newNoti;
  }
  /**
   * 세션에 해당되는 유저의 모든 알림을 가져옵니다.
   * @param param0
   * @returns
   */
  @Query(() => [Notification], { description: '세션에 해당되는 유저의 모든 알림을 가져옵니다.' })
  @UseMiddleware(isAuthenticated)
  async notifications(@Ctx() { verifiedUser }: MyContext): Promise<Notification[]> {
    const notifications = await Notification.find({
      where: {
        userId: verifiedUser.userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return notifications;
  }
}
