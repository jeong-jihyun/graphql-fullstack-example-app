import { IsInt, IsString } from 'class-validator';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { CutReview } from '../entities/CutReview';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { MyContext } from '../apollo/createApolloServer';
import User from '../entities/User';
import { Not } from 'typeorm';

@InputType()
class CreateOrUpdateCutReviewInput {
  @Field(() => Int, { description: '명장면 번호' })
  @IsInt()
  cutId: number;

  @Field({ description: '감상평 내용' })
  @IsString()
  contents: string;
}
/**
 * 감상평을 위한 페이징네이션 구현
 */
@ArgsType()
class PaginationArgs {
  @Field(() => Int, { defaultValue: 2 })
  take: number;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int) cutId: number;
}

@Resolver(CutReview)
export class CutReviewResolver implements ResolverInterface<CutReview> {
  @Mutation(() => CutReview, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async createOrUpdateCutReview(
    @Arg('cutReviewInput') cutReviewInput: CreateOrUpdateCutReviewInput,
    @Ctx() { verifiedUser }: MyContext,
  ): Promise<CutReview | null> {
    if (!verifiedUser) return null;

    const { contents, cutId } = cutReviewInput;
    const prevCutReview = await CutReview.findOne({
      where: {
        cutId,
        user: {
          id: verifiedUser.userId,
        },
      },
    });

    if (prevCutReview) {
      prevCutReview.contents = contents;
      return prevCutReview.save();
    }

    // cutid에 대한 기존 감상평이 없는 경우
    const cutReview = CutReview.create({
      contents: cutReviewInput.contents,
      cutId: cutReviewInput.cutId,
      user: {
        id: verifiedUser.userId,
      },
    });
    return cutReview.save();
  }
  /**
   * 필드 리졸버 user
   * @param cutReview
   * @returns
   */
  @FieldResolver(() => User)
  async user(@Root() cutReview: CutReview): Promise<User> {
    return (await User.findOne({ where: { id: cutReview.userId } }))!;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteReview(@Arg('id', () => Int) id: number, @Ctx() { verifiedUser }: MyContext): Promise<boolean> {
    const result = await CutReview.delete({ id, user: { id: verifiedUser.userId } });

    if (result.affected && result.affected > 0) {
      return true;
    }
    return false;
  }
  /**
   * 감상평 쿼리
   * @param param0
   * @param param1
   * @returns
   */
  @Query(() => [CutReview])
  async cutReviews(
    //@Args() { take, skip, cutId }: PaginationArgs,
    @Arg('cutId', () => Int) cutId: number,
    @Ctx() { verifiedUser }: MyContext,
  ): Promise<CutReview[]> {
    //let realTake = 2;
    let reviewHistory = null;
    if (verifiedUser && verifiedUser.userId) {
      console.log('verifiedUser.userId >>>>', verifiedUser.userId);
      reviewHistory = await CutReview.findOne({
        where: { user: { id: verifiedUser.userId }, cutId },
      });
    }
    //if (reviewHistory) {
    //  realTake = Math.min(take, 1);
    //}
    const reviews = await CutReview.find({
      where: reviewHistory
        ? {
            cutId,
            id: Not(reviewHistory.id),
          }
        : { cutId },
      //skip,
      //take: realTake,
      order: { createdAt: 'DESC' },
    });
    console.log('review end !!! ');
    if (reviewHistory) return [reviewHistory, ...reviews];
    return reviews;
  }
  /**
   * 필드 리졸버 isMine
   * @param param0
   * @returns
   */
  @FieldResolver(() => Boolean)
  isMine(@Ctx() { verifiedUser }: MyContext): boolean {
    if (!verifiedUser) return false;
    return true;
  }
}
