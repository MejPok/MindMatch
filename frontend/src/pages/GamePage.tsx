import { useState, useEffect } from 'react';
import type { GameProps } from "../props/GameProps.ts";
import type { JoinedPlayer, SessionState } from '../types';

function GamePage(props: GameProps){
  const [sessionState, setSessionState ] = useState< SessionState | null >(null);
  const [showingQuestion, setShowingQuestion ] = useState(true);

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


  const [answerInput, setAnswerInput] = useState("");

  return <div className='h-screen w-screen flex justify-center items-center'>
    <div className="rounded-lg bg-mind-mint p-10 border-4 border-mind-blue w-5/6 h-5/6">
      <div className="flex flex-row gap-20 justify-between font-bold">

        <h2 className="text-2xl text-mind-blue">
            {sessionState?.amountOfPlayers} Player{sessionState?.amountOfPlayers === 1 ? "" : "s"}
        </h2>

        <h2 className="text-2xl text-mind-blue">
          Room Code: {props.player.roomCode}
        </h2>

        <h2 className="text-2xl text-mind-blue">
          Round: {sessionState?.roundIndex}/5
        </h2>

      </div>

      <div className='text-center mt-7'>
          {showingQuestion
            ?
            <div>
              <h2 className='text-4xl mb-1'>
                Question 1
              </h2>

              <input type='text' 
                value={answerInput} 
                onChange={(e) => setAnswerInput(e.target.value)}
                className='w-full bg-amber-50 h-10 border-2 border-mind-blue text-center'
                placeholder='Your answer'
              >
              </input>

              <button 
              className='mr-10 ml-10 w-7/12 bg-mind-blue h-10 border-2 border-mind-sky
              text-mind-cream mt-3'
              >
                Submit
              </button>

              <h3>
                {sessionState?.playersAnsweredQuestion} / {sessionState?.amountOfPlayers} Players answered
              </h3>
            </div>

            :
            <div className='flex flex-col'>
              
            </div>

          }
      </div>
    
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