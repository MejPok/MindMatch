import { useState } from 'react';

type JoinedPlayer = {
  playerName: string;
  playerToken: string;
  sessionId: number;
  roomCode: string;
  isSessionOwner: boolean;
  score: number;
};

type RoundInfo = {
  roundState: number;
  roundCount: number;
  timeRemaining: number;
}

const API_BASE = "";
    // window.location.port === "5173" ? "https://localhost:5173" : "https://mindmatch-lukasprogram.runasp.net"; //for hosting purposes

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [gameCreated, setGameCreated] = useState(false);

  const [joinedGame, setJoinedGame] = useState(false);
  const [roomCode, setRoomCode] = useState(""); 

  const [playerName, setPlayerName] = useState("");

  const [player, setPlayer] = useState<JoinedPlayer | null>(null);

  const [roundInfo, setRoundInfo] = useState<RoundInfo>({
        roundState: 0,
        roundCount: 5,
        timeRemaining: 0,
  });

  if(joinedGame && player) {
    return (
      <div className="min-h-screen bg-mind-cream text-mind-blue flex items-center justify-center">
          <GamePage
            player={player}
            setPlayer={setPlayer}

            roundInfo={roundInfo}
            setRoundInfo={setRoundInfo}
          />
      </div> 
    )
  } else if(currentPage == "welcome" || currentPage == "play"){
    return (
      <div className="min-h-screen bg-mind-cream text-mind-blue flex items-center justify-center">
        <WelcomePage state={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    )

  } else if(currentPage == "create" ) {

    return (
      <div className="min-h-screen bg-mind-cream text-mind-blue flex items-center justify-center">
          <CreateGamePage  
            gameCreated={gameCreated} 
            setGameCreated={setGameCreated}

            playerName={playerName}
            setPlayerName={setPlayerName}

            onJoined={setPlayer}

            joinedGame={joinedGame}
            setJoinedGame={setJoinedGame}

            
          />
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
            onJoined={setPlayer}
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
  const [creatingRoom, creatingRoomSet] = useState(false);
  const [error, setError] = useState("");

  async function handleCreatingJoining(){
    const pName = props.playerName.trim();

    if(!pName){
      setError("Enter your name");
      return;
    }

    if(pName.length < 4){
      setError("Enter atleast 4 characters as a name");
      return;
    }

    setError("");
    creatingRoomSet(true);

    //testovani inputu done

    try {
      const createdRoomCode = await createRoom();
      
      const player = await joinRoom(createdRoomCode, pName);
      
      props.onJoined(player);

      sessionStorage.setItem("playerToken", player.playerToken);
      sessionStorage.setItem("sessionId", String(player.sessionId));

      props.setGameCreated(true);
      props.setJoinedGame(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create room.");
    } finally {
      creatingRoomSet(false);
    }

  }

  return <div className="flex flex-col gap-6 rounded-lg bg-mind-mint p-10 border-4 border-mind-blue">
  
    <h1 
      className="text-center text-5xl font-bold"
    >
      Create Room
    </h1>

    <input 
      type='text' 
      className='px-5 py-2 bg-mind-cream border-mind-sky border-2' 
      placeholder="Name"
      onChange={(event) => props.setPlayerName(event.target.value)}
    />

    <button 
      onClick={handleCreatingJoining}
      className="rounded bg-mind-blue px-6 py-3 text-mind-cream hover:bg-mind-sky"
    >
      {!creatingRoom ? "Create": "Creating"}
    </button>

     <h3 className="text-center text-2xl font-bold text-red-600">
        {error && <p role="alert" className="text-red-700">{error}</p>}
    </h3>

  
  </div>
}

function JoinGamePage(props: JoinGameProps){
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  async function handleJoining(){
    const code = props.roomCode.trim();
    const pName = props.playerName.trim();

    if(!/^\d{4}$/.test(code)){
      setError("Enter a 4-digit room code.");
      return;
    }

    if(!pName){
      setError("Enter your name");
      return;
    }

    if(pName.length < 4){
      setError("Enter atleast 4 characters as a name");
      return;
    }

    setError("");
    setJoining(true); //anim

    //testovani inputu done

    try {
      const player = await joinRoom(code,pName);
      sessionStorage.setItem("playerToken", player.playerToken);
      sessionStorage.setItem("sessionId", String(player.sessionId));

      props.onJoined(player);
      props.setJoinedGame(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join room.");
    } finally {
      setJoining(false);
    }

  }


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

  <button 
      onClick={handleJoining}
      disabled={joining}
      className="rounded bg-mind-blue px-6 py-3 text-mind-cream hover:bg-mind-sky"
    >
    {joining ? "Joining…" : "Join room"}
  </button>

  
  <h3 className="text-center text-2xl font-bold text-red-600">
      {error && <p role="alert" className="text-red-700">{error}</p>}
  </h3>

  
  </div>
}

function GamePage(props: GameProps){
  return <div className="rounded-lg bg-mind-mint p-10 border-4 border-mind-blue">

    <div className="flex flex-row gap-20">

      <h2 className="text-2xl text-mind-blue">
        0 Players
      </h2>

      <h2 className="text-2xl text-mind-blue">
        Room Code: {props.player.roomCode}
      </h2>

      <h2 className="text-2xl text-mind-blue">
        Round: 0/5
      </h2>

    </div>
    <div className='text-center'>
      
    </div>
  
  </div>
}

async function joinRoom(joinCode: string, name: string) : Promise<JoinedPlayer> {
  const path =     
    `/api/session/joinRoom/${encodeURIComponent(joinCode)}` +
    `/${encodeURIComponent(name)}`;
//joinRoom/{joinCode}/{name}
  const response = await fetch(`${API_BASE}${path}`, { method: "POST" });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(body || `Request failed (${response.status})`);
  }

  let player = JSON.parse(body) as JoinedPlayer;
  player.roomCode = joinCode;
  return player;
}

async function createRoom() : Promise<string> {
  const path =     
    `/api/session/newRoom`;
//joinRoom/{joinCode}/{name}
  const response = await fetch(`${API_BASE}${path}`, { method: "POST" });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(body || `Request failed (${response.status})`);
  }

  return JSON.parse(body) as string;
}

type GameProps = {
  roundInfo: RoundInfo;
  setRoundInfo:(value: RoundInfo) => void;
  player: JoinedPlayer;
  setPlayer: (player: JoinedPlayer | null) => void;
};


type ControlPageProps = {
  state: string;
  setCurrentPage: (value: string) => void;
};

type CreateGameProps = {
  gameCreated: boolean;
  setGameCreated: (value: boolean) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
  joinedGame: boolean;
  setJoinedGame: (value: boolean) => void;
  onJoined: (player: JoinedPlayer) => void;

};

type JoinGameProps = {
  roomCode: string;
  setRoomCode: (value: string) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
  joinedGame: boolean;
  setJoinedGame: (value: boolean) => void;
  onJoined: (player: JoinedPlayer) => void;
};



export default App
