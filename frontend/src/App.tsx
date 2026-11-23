import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [gameCreated, setGameCreated] = useState(false);

  const [joinedGame, setJoinedGame] = useState(false);
  const [roomCode, setRoomCode] = useState(""); 

  const [playerName, setPlayerName] = useState("");


  if(currentPage == "welcome" || currentPage == "play"){
    return (
      <div className="min-h-screen bg-mind-cream text-mind-blue flex items-center justify-center">
        <WelcomePage state={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    )

  }
  else if(currentPage == "create" ) {

    return (
      <div className="min-h-screen bg-mind-cream text-mind-blue flex items-center justify-center">
          <CreateGamePage  gameCreated={gameCreated} setGameCreated={setGameCreated}/>
      </div> 
    );

  } else if(currentPage == "join" ) {

    return (
      <div className="min-h-screen bg-mind-cream text-mind-blue flex items-center justify-center">
          <JoinGamePage    
          playerName={playerName}
          setPlayerName={setPlayerName}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          joinedGame={joinedGame}
          setJoinedGame={setJoinedGame}
          />
      </div> 
    );

  }
}

function WelcomePage(props: ControlPageProps ){
  return <div className="flex flex-col gap-10">
    <h1 className="text-5xl font-bold text-center">
        {(props.state == "welcome") ? "Welcome to MindMatch" : "Lets Play"}
    </h1>

      {(props.state == "welcome")
        ?
        <>
          <button onClick={() => props.setCurrentPage("play")}
           className="bg-mind-blue text-mind-cream rounded px-10 py-3 display-block">
            Play
          </button>

        </>

        :
        <div className="flex flex-col gap-10">
          <button 
            onClick={() => props.setCurrentPage("create")}
            className="rounded bg-mind-blue px-10 py-2 text-mind-cream hover:bg-mind-sky"
          >
            Create room
          </button>

          <button 
            onClick={() => props.setCurrentPage("join")}
            className="rounded bg-mind-blue px-10 py-2 text-mind-cream hover:bg-mind-sky"
          >


            Join room
          </button>

        </div>

      }
  </div>
}

function CreateGamePage(props: CreateGameProps){
  return <div className="flex flex-col gap-6 rounded-lg bg-mind-mint p-10 border-4 border-mind-blue">
  
    <h1 className="text-center text-5xl font-bold">
      Create Room
    </h1>

    <input type='text' className='px-5 py-2 bg-mind-cream border-mind-sky border-2' placeholder="Name"/>
    <button onClick={() => props.setGameCreated(true)} className="rounded bg-mind-blue px-6 py-3 text-mind-cream hover:bg-mind-sky">
      Create room
    </button>

  
  </div>
}

function JoinGamePage(props: JoinGameProps){
  return <div className="flex w-80 flex-col gap-6 rounded-lg border-4 border-mind-blue bg-mind-mint p-10">
  
  <h1 className="text-center text-4xl font-bold">
    Join Room
  </h1>
  <input type='text'
  placeholder="Your name"
  className="border-2 border-mind-sky bg-mind-cream px-5 py-2"
  value={props.playerName}
  onChange={(event) => props.setPlayerName(event.target.value)}
  />

  <input type='text'
  placeholder="Room code"
  className="border-2 border-mind-sky bg-mind-cream px-5 py-2"
  value={props.roomCode}
  onChange={(event) => props.setRoomCode(event.target.value)}
  />

  <button onClick={() => props.setJoinedGame(true)} className="rounded bg-mind-blue px-6 py-3 text-mind-cream hover:bg-mind-sky">
    Join room
  </button>

  
    </div>
}

type ControlPageProps = {
  state: string;
  setCurrentPage: (value: string) => void;
};

type CreateGameProps = {
  gameCreated: boolean;
  setGameCreated: (value: boolean) => void;
};

type JoinGameProps = {
  roomCode: string;
  setRoomCode: (value: string) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
  joinedGame: boolean;
  setJoinedGame: (value: boolean) => void;
};



export default App
