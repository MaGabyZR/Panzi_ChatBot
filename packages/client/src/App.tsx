import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  //make an API call
  useEffect(() => {
    fetch("/api/hello")
      .then((resp) => resp.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <p className="font-bold p-4 text-3xl">{message}</p>;
}

export default App;
