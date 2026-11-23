import { useState } from 'react';
import type { WebSocketClient } from 'vite';

function App() {
  
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

      <WelcomePage hasStarted={hasStarted} setHasStarted={setHasStarted}/>
    </div>
  )
}

function WelcomePage(props: WelcomePageProps){
  return <>
    <h1 className="text-5xl font-bold">
        {(!props.hasStarted) ? "Welcome to MindMatch" : "Lets Play"}
      </h1>

      {(!props.hasStarted)

        ?
        <button onClick={() => props.setHasStarted(true)}>
          Play
        </button>
  
        :
        <div>
          <button>
            Create Game
          </button>

          <button>
            Join game
          </button>

        </div>

      }
  </>
}

type WelcomePageProps = {
  hasStarted: boolean;
  setHasStarted: (value: boolean) => void;
};

export default App