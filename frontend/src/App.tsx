import { useState } from 'react';
import { GamePage, JoinGamePage, WelcomePage, CreateGamePage} from './pages'
import type { JoinedPlayer } from './types';
import type { RoundInfo } from './types';



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
export default App
