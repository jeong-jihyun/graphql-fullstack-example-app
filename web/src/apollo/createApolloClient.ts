import { ApolloClient, HttpLink, NormalizedCacheObject, from, fromPromise } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createApolloCache } from './createApolloCache';
import { setContext } from '@apollo/client/link/context';
import { refreshAccessToken } from './auth';

let apolloClient: ApolloClient<NormalizedCacheObject>;

/**
 * 에러링크 추가된 항목
 * @description
 * forward addP
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    //console.log(`graphQLErrors >>>`, graphQLErrors);

    if (graphQLErrors.find((err) => err.message === 'access token expired')) {
      return fromPromise(refreshAccessToken(apolloClient, operation))
        .filter((result) => !!result)
        .flatMap(() => forward(operation));
    }

    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: → ${operation.operationName}
      Message: ${message}, Query: ${path}, Location:${JSON.stringify(locations)}`,
      );
    });
  }

  if (networkError) {
    console.log(`[networkError]:→ ${operation.operationName}
    Message: ${networkError.message}`);
  }
});

/**
 * 접속Uri
 */
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const authLink = setContext((request, prevContext) => {
  const accessToken = localStorage.getItem('access_token');
  return {
    headers: {
      ...prevContext.headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});
export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    // new InMemoryCache Add
    cache: createApolloCache(),
    link: from([authLink, errorLink, httpLink]),
  });
