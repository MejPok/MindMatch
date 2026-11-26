import { useState, useEffect } from 'react';
import type { GameProps } from "../props/GameProps.ts";
import type { JoinedPlayer, SessionState } from '../types';

function GamePage(props: GameProps){
  const [sessionState, setSessionState ] = useState< SessionState | null >(null);

  async function startRound(
    sessionId: number,
    playerToken: string
  ): Promise<void> {
    const params = new URLSearchParams({
      sessionId: String(sessionId),
      playerToken,
    });

    const response = await fetch(`${API_BASE}/api/session/StartRound?${params}`, {
      method: "POST",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed (${response.status})`);
    }
}

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
  const showingQuestion = sessionState?.roundState === 1;

  return <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6">
    <div className="w-full h-[90vh] sm:h-[85vh] max-w-5xl rounded-lg bg-mind-mint p-4 sm:p-6 md:p-10 border-4 border-mind-blue">
      <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-4 justify-between font-bold">

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
              {sessionState?.playerNames.map((name, index) => (
                <div key={`${name}-${index}`} 
                className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 rounded border border-mind-blue p-2 font-bold">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mind-blue text-lg font-bold text-mind-cream">
                    {name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="mt-1 text-2xl">{name}</span>

                  <h3 className='text-mind-blue text-center text-2xl'>
                    {sessionState.playerScores != null ? " " + sessionState.playerScores[index] : <></>}
                  </h3>
                </div>
              ))}
            </div>
          }

          
      </div>
      <div className='flex justify-end'>
        {props.player.isSessionOwner ?
          <button className='bg-mind-cream text-2xl rounded-2xl border-2 p-2 
          hover:bg-mind-sky hover:text-white'
            onClick={async () => {
              try {
                await startRound(props.player.sessionId, props.player.playerToken);
              } catch (error) {
                console.error("Could not advance the round:", error);
              }
            }}
            >
            Next {sessionState?.roundIndex === 2 ? "round" : "phase" }
          </button>
          :
          <></>  
        }
      </div>
          
    </div>
  </div>
}

const API_BASE =
    window.location.port === "5173" ? "https://localhost:7149" : "https://mindmatch-lukasprogram.runasp.net"; //for hosting purposes

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
export default GamePage;