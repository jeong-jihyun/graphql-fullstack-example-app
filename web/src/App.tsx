import * as React from "react"
import {
  Box,
  ChakraProvider,
  theme, Text
} from "@chakra-ui/react"
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import FilmList from "./components/film/FilmList"

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})
export const App = () => (
  <ApolloProvider client={apolloClient}>
    <ChakraProvider theme={theme}>
      <Box>
        <Text>Ghibli GraphQL</Text>
      </Box>
      <FilmList />
    </ChakraProvider>
  </ApolloProvider>
)
