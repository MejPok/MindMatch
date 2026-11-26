import { useState, useEffect } from 'react';
import type { GameProps } from "../props/GameProps.ts";
import type { JoinedPlayer, SessionState } from '../types';

function GamePage(props: GameProps){
  const [sessionState, setSessionState ] = useState< SessionState | null >(null);

  useEffect(() => {
    const interval = setInterval(async () => {
        try {
            const state = await fetchSessionState(props.player.sessionId, props.player.playerToken);
            setSessionState(state);
            console.log(state);
        } catch (error) {
            console.error(error);
        }
    }, 500);

    return () => clearInterval(interval);
}, []);

  return <div className="rounded-lg bg-mind-mint p-10 border-4 border-mind-blue">
    <div className="flex flex-row gap-20">

      <h2 className="text-2xl text-mind-blue">
        {sessionState?.amountOfPlayers} Players
      </h2>

      <h2 className="text-2xl text-mind-blue">
        Room Code: {props.player.roomCode}
      </h2>

      <h2 className="text-2xl text-mind-blue">
        Round: {sessionState?.roundIndex}/5
      </h2>

    </div>
    <div className='text-center'>
      
    </div>
  
  </div>
}

const API_BASE = "";

export async function fetchSessionState(
    sessionId: number,
    playerToken: string
): Promise<SessionState> {
    const path = `/api/session?sessionId=${sessionId}&playerToken=${encodeURIComponent(playerToken)}`;

    const response = await fetch(
        `${API_BASE}${path}`
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data: SessionState = await response.json();

    return data;
}

async function getSessionState(player: JoinedPlayer){
  try {
      const state = await fetchSessionState(player.sessionId, player.playerToken);

      console.log(state);

      if (state.sessionStarted) {
          console.log("Game started!");
          console.log("Round:", state.roundIndex);
      }

  } catch (error) {
      console.error("Failed to fetch session:", error);
  }
}
export default GamePage;