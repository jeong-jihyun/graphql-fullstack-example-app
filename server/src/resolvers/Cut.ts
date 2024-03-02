import { Arg, Int, Query, Resolver } from 'type-graphql';
import { Cut } from '../entities/Cut';
import { Film } from '../entities/Film';
import ghibliData from '../data/ghibli';

/**
 * 불러올 수 있는 resolver를 추가
 */
@Resolver(Cut)
export class CutResolver {
  @Query(() => [Cut])
  cuts(@Arg('filmId', () => Int) filmId: Film['id']): Cut[] {
    return ghibliData.cuts.filter((x) => x.filmId === filmId);
  }
}
