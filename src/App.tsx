import React from 'react';

export const App: React.FC = () => {
  const fn = async() => {alert("got async!")}
  return <div>
    <h1>Hello React 4</h1>
    <button onClick={()=>fn()}>click</button>
  </div>;
};