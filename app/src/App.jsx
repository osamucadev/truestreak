import { useState } from "react";

function App() {
  const [message, setMessage] = useState("TrueStreak");

  return (
    <div className="app">
      <div className="container">
        <h1>{message}</h1>
        <p className="subtitle">
          O app de treino que não te pune por ser humano
        </p>
        <button
          className="btn-primary"
          onClick={() => setMessage("TrueStreak está funcionando! 🔥")}
        >
          Testar React
        </button>
      </div>
    </div>
  );
}

export default App;
