import './styles.css';
import reactPng from "./React.png";
import reactSvg from "./React-icon.svg";

export const App = () => {
    const fn = async() => {
      alert("got async");
    };

    return (
      <>
        <h1>React TypeScript Webpack Starter Template</h1>
        <img src={reactPng} />
        <img src={reactSvg} />
        <button onClick={()=>fn()}></button>
      </>
    )
  }