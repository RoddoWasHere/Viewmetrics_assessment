import React from 'react';

export const Other: React.FC = () => {
  const fn = async() => {alert("got async!")}
  return <div>
    <h1>Other page</h1>
    <button onClick={()=>fn()}>click</button>
  </div>;
};