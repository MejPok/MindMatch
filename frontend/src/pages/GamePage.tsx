import { useState, useEffect } from 'react';
import type { GameProps } from "../props/GameProps.ts";

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

export default GamePage;