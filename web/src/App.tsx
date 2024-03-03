import { ApolloProvider } from '@apollo/client';
import {
  ChakraProvider,
  theme
} from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createApolloClient } from "./apollo/createApolloClient";
import Film from "./pages/Film";
import Login from "./pages/Login";
import Main from "./pages/Main";
import SignUp from "./pages/SignUp";

const apolloClient = createApolloClient();

export const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/film/:filmId" element={<Film />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </ApolloProvider>
  )
}
