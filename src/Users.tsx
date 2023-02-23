import React, { ReactNode } from 'react';
import { useNavigate, Outlet } from 'react-router';


export const Users: React.FC = ({children}) => {
    console.log("passed args?", children);
  const navigate = useNavigate();
  const fn = async() => {navigate("other")}
  return <div>
    <h1>Users?</h1>
    <button onClick={()=>fn()}>click</button>
    <div>{ children }</div>
    <Outlet/>
  </div>;
};