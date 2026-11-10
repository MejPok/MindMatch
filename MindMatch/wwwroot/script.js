const joinedMatch = false;
const sessionId = false;
const playerToken = "";
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

async function JoinRoom(){
    let roomCode = document.getElementById('roomCodeInput');
    let playerName = document.getElementById('nameInput');

    if(roomCode.textContent.length == 4){


    } else {
        alert("room code too short");
    }
}

async function createRoom() {
  return apiRequest("/api/session/newRoom", { method: "POST" });
}

async function CreateRoom(){
    let playerName = document.getElementById('nameInput');
    if(playerName.textContent.length >= 4){
        const joinCode = await createRoom();
        roomCode = joinCode;
        console.log("Room code:", joinCode);

        

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