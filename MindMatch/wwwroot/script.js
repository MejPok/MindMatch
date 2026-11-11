let joinedMatch = false;
const API_BASE = "https://localhost:7149";
let roomCode = 0;
let isSessionOwner = false;

document.addEventListener("DOMContentLoaded", () => {
    if(joinedMatch == false){
        CreateStartScreen();
        return;
    }
});

const playField = document.getElementById('playField');

function CreateStartScreen(){
    /*
    document.getElementById("scoreBoard").hidden = true;
    document.getElementById("gameScreen").hidden = true;
    */
   
    const nameInput = document.createElement("input");
    nameInput.id = 'nameInput';
    nameInput.type = "text";
    nameInput.maxLength = 20;
    nameInput.required = true;
    nameInput.placeholder = "Your Name";
    nameInput.style.width = '50%';
    nameInput.style.marginBottom = '10%';

    nameInput.classList.add("centeredObject");
    
    let joinLobbyText = document.createElement('h2');
    joinLobbyText.textContent = 'Join Room';
    joinLobbyText.classList.add('centeredObject');

    const roomCodeInput = document.createElement("input");
    roomCodeInput.id = 'roomCodeInput';
    roomCodeInput.type = "text";
    roomCodeInput.inputMode = "numeric";
    roomCodeInput.pattern = "[0-9]{4}";
    roomCodeInput.maxLength = 4;
    roomCodeInput.required = true;
    roomCodeInput.placeholder = "4-digit room code";
    roomCodeInput.classList.add("centeredObject");

    roomCodeInput.style.width = '80%';
    roomCodeInput.style.height = '20%';


    let joinRoomButton = document.createElement('input');
    joinRoomButton.type = "button";
    joinRoomButton.value = "Join Room";
    joinRoomButton.classList.add("centeredObject");

    joinRoomButton.addEventListener("click", () => JoinRoom());
    


    let createLobbyText = document.createElement('h3');
    createLobbyText.textContent = 'Create Room';
    createLobbyText.classList.add('centeredObject');

    let createLobbyButton = document.createElement('input');
    createLobbyButton.type = "button";
    createLobbyButton.value = "Create";
    createLobbyButton.style.width = '50%';
    createLobbyButton.addEventListener("click", CreateRoom);


    createLobbyButton.classList.add('centeredObject');



    
    playField.append(nameInput);

    
    playField.append(joinLobbyText);
    
    
    playField.append(roomCodeInput);

    playField.append(joinRoomButton);

    playField.append(createLobbyText);

    playField.append(createLobbyButton);


}


async function joinRoom(joinCode, name) {
  const path =
    `/api/session/joinRoom/${encodeURIComponent(joinCode)}` +
    `/${encodeURIComponent(name)}`;

  return apiRequest(path, { method: "POST" });
}


async function JoinRoom(joinCodePassed = null){
    let roomCodeInput = document.getElementById('roomCodeInput');
    let playerName = document.getElementById('nameInput');
    let code;
    if(joinCodePassed == null){
      if (roomCodeInput.value.trim().length < 4) {
        alert("Enter a 4-digit room code.");
        return;
      }

      code = roomCodeInput.value.trim();

    } else {
      code = joinCodePassed;
    }
    

    try{
        const player = await joinRoom(code, playerName.value.trim());
        console.log(player.playerName);
        console.log(player.sessionId);

        sessionStorage.setItem("playerToken", player.playerToken);
        sessionStorage.setItem("sessionId", player.sessionId);

        joinedMatch = true;
        console.log("joined fine hopefully");
        ShowRoomScreen();
        getSessionState();

        if(isSessionOwner){
          document.getElementById('nextPhaseButton').addEventListener('click', tryNextPhase);
        } else {
          document.getElementById('nextPhaseButton').hidden = true;
        }

    } catch {
        alert(`Could not join room: ${error.message}`);
        return;
    }

    
    
}

async function  tryNextPhase(p) {
  try{
    const params = new URLSearchParams({
      sessionId: sessionStorage.getItem("sessionId") ?? "",
      playerToken: sessionStorage.getItem("playerToken") ?? ""
    });

    const response = await fetch(`${API_BASE}/api/session?${params}`, {
      method: "POST"
    });
  } catch(error){
    console.log(`${error.message}`);
  }
  
}

async function ShowRoomScreen(){
  document.getElementById("playField").hidden = true;

  document.getElementById("scoreBoard").hidden = false;
  document.getElementById("gameScreen").hidden = false;
}


async function createRoom() {
  return apiRequest("/api/session/newRoom", { method: "POST" });
}

async function CreateRoom(){
    let playerName = document.getElementById('nameInput');
    if(playerName.value.length > 4){
        const joinCode = await createRoom();
        console.log("Room code:", joinCode);

        JoinRoom(joinCode);
        isSessionOwner = true;

        roomCode = joinCode;
    } else {
        alert("name too short");
    }
   
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
  }

  if (!response.ok) {
    throw new Error(typeof data === "string" ? data : JSON.stringify(data));
  }

  return data;
}

let stopped = false;
let timer;

let sessionState;

async function getSessionState() {
  const params = new URLSearchParams({
    sessionId: sessionStorage.getItem("sessionId") ?? "",
    playerToken: sessionStorage.getItem("playerToken") ?? ""
  });

  try{
    const response = await fetch(`${API_BASE}/api/session?${params}`);

    if(!response.ok){

      console.error("cannot get session state", await response.text());
      return;
    }

    const state = await response.json();
    sessionState = state;
    updatePageBasedOnSessionState(state);
    console.log(state);

  } catch( error ){
    console.error("something failed", error);


  } finally {
    if(!stopped){

      timer = setTimeout(getSessionState, 1000);
    }
  }
}

function stopPolling() {
  stopped = true;
  clearTimeout(timer);
}




async function updatePageBasedOnSessionState(sessionState){
    let numberOfPlayers = document.getElementById('numberOfPlayers');
    let roomCodeParagraph = document.getElementById('roomCodeParagraph');
    let phaseInfo = document.getElementById('phaseInfo');
    let questionDiv = document.getElementById('questionDiv');
    let questionInput = document.getElementById('questionInput');

    numberOfPlayers.textContent = `${sessionState.amountOfPlayers} players`;
    if(sessionState.RoundIndex == 1){
        numberOfPlayers.textContent = `${sessionState.playersAnsweredQuestion} / ${sessionState.amountOfPlayers} players answered`;
    }

    roomCodeParagraph.textContent = `Room Code: ${roomCode}`;

    if(sessionState.roundState == 0){
        phaseInfo.textContent = "Waiting for start";
        questionDiv.hidden = true;
        questionInput.hidden = true;

    } else if(sessionState.roundState == 1){
        phaseInfo.textContent = "Not everyone answered yet";

        questionDiv.textContent = `${sessionState.roundQuestion}`;

        questionDiv.hidden = false;
        questionInput.hidden = false;
    } else if(sessionState.roundState == 2){
        phaseInfo.textContent = "Waiting for next round";
        questionInput.hidden = true;
    }
}

