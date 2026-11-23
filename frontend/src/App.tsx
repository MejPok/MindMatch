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
            className="rounded bg-mind-blue px-10 py-2 text-white hover:bg-blue-700"
          >
            Create room
          </button>

          <button 
            onClick={() => props.setCurrentPage("join")}
            className="rounded bg-mind-blue px-10 py-2 text-white hover:bg-blue-700"
          >


            Joine room
          </button>

        </div>

      }
  </div>
}

function CreateGamePage(props: CreateGameProps){
  return <div className="flex flex-col gap-10 bg-mind-mint px-30 py-10 border-mind-blue border-5">
  
    <h1 className="text-center text-5xl font-bold">
      Create Room
    </h1>

    <input type='text' className='px-5 py-2 bg-mind-cream border-mind-sky border-2' placeholder="Name"/>
    <button onClick={() => props.setGameCreated(true)}>

    </button>

  
  </div>
}

function JoinGamePage(props: JoinGameProps){
  return <>
  
  <h1>
    Join Room
  </h1>
  <input type='text'
  value={props.playerName}
  onChange={(event) => props.setPlayerName(event.target.value)}
  />

  <input type='text'
  value={props.roomCode}
  onChange={(event) => props.setRoomCode(event.target.value)}
  />

  <button onClick={() => props.setJoinedGame(true)}>

  </button>

  
    </>
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