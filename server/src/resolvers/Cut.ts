import { Arg, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql';
import { Cut } from '../entities/Cut';
import { Film } from '../entities/Film';
import ghibliData from '../data/ghibli';

/**
 * 불러올 수 있는 resolver를 추가 > index.ts에도 추가 필요
 */
@Resolver(Cut)
export class CutResolver {
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
