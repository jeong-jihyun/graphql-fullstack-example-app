import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Cut } from '../entities/Cut';
import { Film } from '../entities/Film';
import ghibliData from '../data/ghibli';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { MyContext } from '../apollo/createApolloServer';
import { CutVote } from '../entities/CutVote';
import { JwtVerifiedUser } from 'src/utils/jwt-auth';

/**
 * 불러올 수 있는 resolver를 추가 > index.ts에도 추가 필요
 */
@Resolver(Cut)
export class CutResolver {
  /**
   * 로그인한 유저가 명장면에 좋아요를 표시했는지에 대한 정보를 조회하는 필드 구성
   * @param cut
   * @param param1
   * @returns
   */
  @FieldResolver(() => Boolean)
  async isVoted(@Root() cut: Cut, @Ctx() { cutVoteLoader, verifiedUser }: MyContext): Promise<boolean> {
    if (verifiedUser) {
      const votes = await cutVoteLoader.load({ cutId: cut.id });
      if (votes.some((vote) => vote.userId === verifiedUser.userId)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  /**
   * 좋아요 조회 쿼리
   * @param cut
   * @returns
   * @description
   *  명장면의 총 좋아요 개수
   *  로그인한 유저가 명장면에 좋아요를 표시했는가?
   */
  @FieldResolver(() => Int)
  async votesCount(@Root() cut: Cut, @Ctx() { cutVoteLoader }: MyContext): Promise<number> {
    // const count = await CutVote.count({ where: { cutId: cut.id } });
    // return count;
    const cutVotes = await cutVoteLoader.load({ cutId: cut.id });
    return cutVotes.length;
  }
  /**
   * 좋아요 뮤테이션
   * @param cutId
   * @param param1
   * @returns
   */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async vote(@Arg('cutId', () => Int) cutId: number, @Ctx() { verifiedUser }: MyContext): Promise<boolean> {
    console.log('============================================');
    console.info(verifiedUser as JwtVerifiedUser);
    console.log('============================================');

    if (verifiedUser) {
      const { userId } = verifiedUser as JwtVerifiedUser;
      console.log('userId >>>', verifiedUser.userId);

      const alreadyVoted = await CutVote.findOne({
        where: {
          cutId,
          userId,
        },
      });

      if (alreadyVoted) {
        await alreadyVoted.remove();
        return true;
      }

      console.info('userId >>>', userId);
      console.info('cutId >>>', cutId);

      const vote = CutVote.create({ cutId, userId });
      await vote.save();
      return true;
    }
    return false;
  }
  /**
   * 명장면 이미지 정보를 추출
   * @param filmId
   * @returns
   */
  @Query(() => [Cut])
  cuts(@Arg('filmId', () => Int) filmId: Film['id']): Cut[] {
    return ghibliData.cuts.filter((x) => x.filmId === filmId);
  }
  /**
   *
   * @param cutId
   * @returns
   */
  @Query(() => Cut, { nullable: true })
  cut(@Arg('cutId', () => Int) cutId: number): Cut | undefined {
    return ghibliData.cuts.find((x) => x.id === cutId);
  }
  /**
   * 모달창의 제목으로 영화제목을 보여주기 위한 용도
   * @param cut
   * @returns
   */
  @FieldResolver(() => Film, { nullable: true })
  film(@Root() cut: Cut): Film | undefined {
    return ghibliData.films.find((data) => data.id === cut.filmId);
  }
}
