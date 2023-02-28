import React from 'react';
// import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { Profile } from './views/Profile';
import './style.css';
import MainLayout from './components/mainLayout';
import UserListing from './views/UserListing';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import Videos from './views/Videos';
import { LocalStoreProvider } from './utils/localStore';
import ThemeProviderCustom from './providers/themeProvider';
import Home from './views/Home';
import Settings from './views/Settings';

const rootNode = document.getElementById('app');

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout><Outlet/></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "users",
        element: <UserListing/>,
        children: [
          {
            path: "page/:pageNumber",
          },
        ]
      },
      {
        path: "user/:id",
        element: <Profile/>
      },
      {
        path: "upload-video",
        element: <Videos/>,
      },
      {
        path: "settings",
        element: <Settings/>,
      },
    ],
  },
]);



if(rootNode){
  createRoot(rootNode).render(
    <ApolloProvider client={client}>
      <LocalStoreProvider>
        <ThemeProviderCustom>
          <RouterProvider router={router}/>
        </ThemeProviderCustom>
      </LocalStoreProvider>
    </ApolloProvider>
  );
}
