import { useState } from 'react';
import type { CreateGameProps } from '../props';
import type { JoinedPlayer } from '../types';

function CreateGamePage(props: CreateGameProps){
  const [creatingRoom, creatingRoomSet] = useState(false);
  const [error, setError] = useState("");
  const [createdQuestions, setCreatedQuestions] = useState(false);
  const [creatingQuestions, setCreatingQuestions] = useState(false);

  const [questionsArray, setQuestionArray] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);

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
      
      await createQuestions(player.sessionId, player.playerToken, questionsArray);
      props.setGameCreated(true);
      props.setJoinedGame(true);

      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create room.");
    } finally {
      creatingRoomSet(false);
    }

  }

  async function createQuestions(
    sessionId: number,
    playerToken: string,
    questionsForRounds: string[]
    ) {

    const path =     
    `/api/session/CreateQuestions/${sessionId}/${playerToken}`;

    const response = await fetch(
        `${API_BASE}${path}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(questionsForRounds)
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
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

    {creatingQuestions ? 
      <div className="border-2 border-amber-100 flex flex-col gap-2">

        {questionsArray.map((question, index) => (
          <input
              className='bg-mind-cream text-black text-2xl m-2 text-center border-2 border-black' 
              placeholder={String( "Question " + (index + 1))}
              key={index}
              value={question}
              onChange={(e) => {
                  const updatedQuestions = [...questionsArray];
                  updatedQuestions[index] = e.target.value;
                  setQuestionArray(updatedQuestions);
              }}
          />
      ))}

      </div>
      :
      <> </>
    }

    <button 
      onClick={() => {
        if(createdQuestions){
          handleCreatingJoining();
        } else {
          
            setCreatedQuestions(true);
            setCreatingQuestions(true);
          
        }
      }}
      className="rounded bg-mind-blue px-6 py-3 text-mind-cream hover:bg-mind-sky"
    >
      {!creatingRoom ? "Create": "Creating"}
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


export default CreateGamePage;