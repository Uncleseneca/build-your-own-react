import "./styles.css";
import { React } from "./react";
import { createResource } from "./dogApi";
const resourse = createResource();

function App() {
  const [state, setState] = React.useState(1);
  const handler = () => setState(state + 1);
  const dogs = resourse.read(state);
  return (
    <main>
      <h1>fetching dogs</h1>
      <button onClick={handler}>Click {state}</button>
      <div>{state}</div>

      {dogs.map(dog => (
        <img src={dog} />
      ))}
    </main>
  );
}

const container = document.getElementById("root");
const element = <App />;
React.createRoot(container).render(element);
