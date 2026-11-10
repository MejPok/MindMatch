const joinedMatch = false;
const API_BASE = "https://localhost:7149";
const roomCode = 0;

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

    joinRoomButton.addEventListener("click", JoinRoom);
    


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

async function JoinRoom(e){
    let roomCode = document.getElementById('roomCodeInput');
    let playerName = document.getElementById('nameInput');

    if(e != null){
        const player = await joinRoom(e, playerName.value);
        console.log(player.playerName);
    console.log(player.sessionId);
    localStorage.setItem("playerToken", player.playerToken);
    localStorage.setItem("sessionId", player.sessionId);
    } 
    else if(roomCode.textContent.length == 4){
        const player = await joinRoom(roomCode.textContent, playerName.value);
        console.log(player.playerName);
        console.log(player.sessionId);
        localStorage.setItem("playerToken", player.playerToken);
        localStorage.setItem("sessionId", player.sessionId);
    } else {
        alert("room code too short");
        return;
    }

    joinedMatch = true;
    console.log("joined fine hopefully");
    ShowRoomScreen();
    
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