import { ApolloClient, HttpLink, NormalizedCacheObject, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createApolloCache } from './createApolloCache';
import { setContext } from '@apollo/client/link/context';

/**
 * 에러링크 추가된 항목
 */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`[GraphQL error]: → ${operation.operationName}
      Message: ${message}, Query: ${path}, Location:${JSON.stringify(locations)}`);
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
});

const authLink = setContext((request, prevContext) => {
  const accessToken = localStorage.getItem('access_token');

  return {
    headers: {
      ...prevContext.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});
export const createApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    // new InMemoryCache Add
    cache: createApolloCache(),
  });
