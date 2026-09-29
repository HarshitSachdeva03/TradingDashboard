import { useState, useEffect } from "react";

const App = () => {
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8000/ping");
      const json = await res.json();
      setMsg(json.message);
    };
    load();
  }, []);

  return <h1>{msg}</h1>;
};

export default App;