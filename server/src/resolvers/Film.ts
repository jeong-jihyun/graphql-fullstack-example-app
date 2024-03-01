import { Arg, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Film } from '../entities/Film';
import ghibliData from '../data/ghibli';
import { Director } from '../entities/Director';
import { PaginatedFilms } from '../entities/PaginatedFilms';

@Resolver(Film)
export class FilmResolver {
  //
  // 이전에 데이타 추출 방식을 아래 pagination 변경처리
  //
  // @Query(() => [Film])
  // films(): Film[] {
  //   return ghibliData.films;
  // }

  @FieldResolver(() => Director)
  director(@Root() parentFilm: Film): Director | undefined {
    return ghibliData.directors.find((dr) => dr.id === parentFilm.director_id);
  }

  @Query(() => PaginatedFilms)
  films(
    @Arg('limit', () => Int, { nullable: true, defaultValue: 6 }) limit: number,
    @Arg('cursor', () => Int, { nullable: true, defaultValue: 1 }) cursor: Film['id'],
  ): PaginatedFilms {
    const realLimit = Math.min(6, limit);
    if (!cursor) return { films: [] };

    const cursorDataIndex = ghibliData.films.findIndex((x) => x.id === cursor);
    if (cursorDataIndex === -1) return { films: [] };

    const result = ghibliData.films.slice(cursorDataIndex, cursorDataIndex + realLimit);
    const nextCursor = result[result.length - 1].id + 1;
    const hasNext = ghibliData.films.findIndex((x) => x.id === nextCursor) > -1;

    return { cursor: hasNext ? nextCursor : null, films: result };
  }
}
