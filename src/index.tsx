import React from 'react';
// import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Other } from './Other';
import { Users } from './Users';
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
// const process = require('process');

const rootNode = document.getElementById('app');

console.log("env?", process.env);
console.log("env.node_env?", process.env.NODE_ENV);

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout><Outlet/></MainLayout>,
    // loader: rootLoader,
    children: [
      {
        path: "/",
        element: <Home/>,
        // loader: teamLoader,
        // children: [
        //   {
        //     path: "page/:pageNumber",
        //     // element: <Profile />,
        //     // loader: teamLoader,
        //   },
        // ]
      },
      {
        path: "users",
        element: <UserListing/>,
        // loader: teamLoader,
        children: [
          {
            path: "page/:pageNumber",
            // element: <Profile />,
            // loader: teamLoader,
          },
        ]
      },
      {
        path: "user/:id",
        element: <Profile/>
        // loader: teamLoader,
        // children: [
        //   {
        //     path: "page/:pageNumber",
        //     // element: <Profile />,
        //     // loader: teamLoader,
        //   },
        // ],
      },
      {
        path: "upload-video",
        element: <Videos/>,
        // loader: teamLoader,
        // children: [
        //   {
        //     path: "page/:pageNumber",
        //     // element: <Profile />,
        //     // loader: teamLoader,
        //   },
        // ]
      },
      {
        path: "settings",
        element: <Settings/>,
        // loader: teamLoader,
        // children: [
        //   {
        //     path: "page/:pageNumber",
        //     // element: <Profile />,
        //     // loader: teamLoader,
        //   },
        // ]
      },
    ],
  },
  // {
  //   path: "users",
  //   element: <MainLayout><UserListing/></MainLayout>,
  //   // loader: teamLoader,
  //   children: [
  //     {
  //       path: "page/:pageNumber",
  //       // element: <Profile />,
  //       // loader: teamLoader,
  //     },
  //   ],
  // },
  // {
  //   path: "user/:id",
  //   element: <MainLayout><Profile/></MainLayout>,
  //   // loader: teamLoader,
  //   // children: [
  //   //   {
  //   //     path: "page/:pageNumber",
  //   //     // element: <Profile />,
  //   //     // loader: teamLoader,
  //   //   },
  //   // ],
  // },
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
  // createRoot(rootNode)
  //   .render(<App />);
}
