import { Arg, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Film } from '../entities/Film';
import ghibliData from '../data/ghibli';
import { Director } from '../entities/Director';
import { PaginatedFilms } from '../entities/PaginatedFilms';
/**
 * 영화정보 리졸버
 * @description 영화 목록을 web에 전달을 합니다.
 */
@Resolver(Film)
export class FilmResolver {
  /**
   * 전체리스트
   * @returns
   */
  @Query(() => [Film])
  totalfilms(): Film[] {
    return ghibliData.films;
  }
  /**
   * 제작자 정보 추출
   * @param parentFilm
   * @returns
   */
  @FieldResolver(() => Director)
  director(@Root() parentFilm: Film): Director | undefined {
    return ghibliData.directors.find((dr) => dr.id === parentFilm.director_id);
  }
  /**
   * 페이징 목록을 추출
   * @param limit
   * @param cursor
   * @returns
   */
  @Query(() => PaginatedFilms)
  films(
    @Arg('limit', () => Int, { nullable: true, defaultValue: 6 }) limit: number,
    @Arg('cursor', () => Int, { nullable: true, defaultValue: 1 }) cursor: Film['id'],
  ): PaginatedFilms {
    // 6개로 제한
    const realLimit = Math.min(6, limit);
    // 빈 어레이를 반환
    if (!cursor) return { films: [] };

    const cursorDataIndex = ghibliData.films.findIndex((x) => x.id === cursor);
    if (cursorDataIndex === -1) return { films: [] };

    const result = ghibliData.films.slice(cursorDataIndex, cursorDataIndex + realLimit);
    const nextCursor = result[result.length - 1].id + 1;
    const hasNext = ghibliData.films.findIndex((x) => x.id === nextCursor) > -1;

    return { cursor: hasNext ? nextCursor : null, films: result };
  }
  /**
   * 영화 상세정보를 추출을 합니다.
   * @param filmId
   * @returns
   */
  @Query(() => Film, { nullable: true })
  film(@Arg('filmId', () => Int) filmId: number): Film | undefined {
    return ghibliData.films.find((data) => data.id === filmId);
  }
}
