import type { ControlPageProps } from "../props"
import { useState } from 'react';
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
export default WelcomePage;