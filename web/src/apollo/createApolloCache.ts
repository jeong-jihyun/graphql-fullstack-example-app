import { InMemoryCache } from '@apollo/client';
import { PaginatedFilms } from '../graphql/queries/generated/graphql';

// App.tsx > createApolloCache move
export const createApolloCache = (): InMemoryCache => {
  return new InMemoryCache({
    // typePolicies → Query → filelds → films
    typePolicies: {
      Query: {
        fields: {
          films: {
            // 캐시가 키값으로 사용하는 인자 목록
            keyArgs: false,
            merge: (existing: PaginatedFilms | undefined, incoming: PaginatedFilms): PaginatedFilms => {
              return {
                cursor: incoming.cursor,
                films: existing ? [...existing.films, ...incoming.films] : incoming.films,
              };
            },
          },
        },
      },
    },
  });
};
