import { useState, useEffect } from 'react';
import type { JoinGameProps } from '../props';
import type { JoinedPlayer } from '../types';


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

const API_BASE = "";

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

export default JoinGamePage;
