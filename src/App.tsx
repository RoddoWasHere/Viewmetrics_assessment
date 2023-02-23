import React from 'react';
import { NavLink } from "react-router-dom";
import { EventHandler } from './utils/EventHandler';
import { useNavigate } from 'react-router';
import NavBar from './components/navBar';
import MainLayout from './components/mainLayout';



const eH = new EventHandler<string>();
eH.addEventListener((d) => console.log("listener 1", d));
eH.addEventListener((d) => console.log("listener 2", d));
eH.emitEvent("123?");


export const App: React.FC = () => {
  const navigate = useNavigate();
  const fn = async() => {navigate("other")};
  return <MainLayout
      leftPageContents={<button>left</button>}   
      mainPageContents={<button>main</button>}   
    />;
  // return <div>
  //   <h1>Hello React 4</h1>
  //   <NavLink to="other">click here</NavLink>
  //   <button onClick={()=>fn()}>click</button>
  // </div>;
};