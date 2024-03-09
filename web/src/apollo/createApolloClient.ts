import { ApolloClient, HttpLink, NormalizedCacheObject, from, fromPromise, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createApolloCache } from './createApolloCache';
import { setContext } from '@apollo/client/link/context';
//import { WebSocketLink } from '@apollo/client/link/ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { refreshAccessToken } from './auth';
import { getMainDefinition } from '@apollo/client/utilities';
//import { createUploadLink } from 'apollo-upload-client';
import { createClient } from 'graphql-ws';

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

/**
 * 업로드 링크 설정
 */
//const httpUploadLink = createUploadLink({
//  uri: 'http://localhost:4000/graphql',
//  fetchOptions: 'include',
//});
/**
 * 액세스 토큰
 */
const authLink = setContext((request, prevContext) => {
  const accessToken = localStorage.getItem('access_token');
  return {
    headers: {
      ...prevContext.headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => ({
      Authorization: localStorage.getItem('access_token') ? `Bearer ${localStorage.getItem('access_token')}` : '',
    }),
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  from([wsLink]),
  from([authLink, errorLink, httpLink]),
);

/**
 *
 * @returns
 */
export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    // new InMemoryCache Add
    cache: createApolloCache(),
    // httpUploadLink as any
    link: splitLink, //
  });
  return apolloClient;
};
