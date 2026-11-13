let joinedMatch = false;
const API_BASE = "https://localhost:7149";
let roomCode = 0;
let isSessionOwner = false;

document.addEventListener("DOMContentLoaded", () => {
    if(joinedMatch == false){
        CreateStartScreen();
    }

     document
    .getElementById("submitQuestionButton")
    .addEventListener("click", submitAnswer);
});

const playField = document.getElementById('playField');

function CreateStartScreen(){
    
    document.getElementById("scoreBoard").hidden = true;
    document.getElementById("gameScreen").hidden = true;
    
   
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

    document.getElementById("playField").hidden = false;

    document.getElementById("scoreBoard").hidden = true;
    document.getElementById("gameScreen").hidden = true;








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
          document.getElementById('nextPhaseButton').addEventListener('click', () => {
            tryNextPhase();
          });
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

async function askOwnerForRoundQuestions() {
  const questions = [];
  const roundCount = 5;

  for (let i = 0; i < roundCount;) {
    const question = prompt(`Enter question ${i + 1} of ${roundCount}:`);

    if (question === null || question.trim() === "") {
      alert("A question is required to create the room.");
      continue;
    }

    questions.push(question.trim());
    i++;
  }

  const sessionId = sessionStorage.getItem("sessionId");
  const playerToken = sessionStorage.getItem("playerToken");
  const params = new URLSearchParams({ sessionId, playerToken });
  const path = `/api/session/CreateQuestions/${encodeURIComponent(sessionId)}/${encodeURIComponent(playerToken)}?${params}`;

  await apiRequest(path, {
    method: "POST",
    body: JSON.stringify(questions)
  });
}

async function CreateRoom(){
    let playerName = document.getElementById('nameInput');
    if(playerName.value.length > 4){
        const joinCode = await createRoom();
        console.log("Room code:", joinCode);

        isSessionOwner = true;
        await JoinRoom(joinCode);
        await askOwnerForRoundQuestions();

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

    if(sessionState.sessionEnded && sessionState.sessionStarted){
      document.getElementById("playField").hidden = true;
      document.getElementById("gameScreen").hidden = true;

      document.getElementById("scoreBoard").hidden = false;
      return;
    }

    updatePageBasedOnSessionState(state);

    if(sessionState.sessionStarted){
      showStatsScreen(state);
    }
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
    let submitButton = document.getElementById('submitQuestionButton');


    numberOfPlayers.textContent = `${sessionState.amountOfPlayers} players`;
    if(sessionState.RoundIndex == 1){
        numberOfPlayers.textContent = `${sessionState.playersAnsweredQuestion} / ${sessionState.amountOfPlayers} players answered`;
    }

    roomCodeParagraph.textContent = `Room Code: ${roomCode}`;

    if(sessionState.roundState == 0){
        phaseInfo.textContent = "Waiting for start";
        questionDiv.hidden = true;
        questionInput.hidden = true;
        submitButton.hidden = true;

    } else if(sessionState.roundState == 1){

        phaseInfo.textContent = "Not everyone answered yet";
        submitButton.hidden = false;
        questionDiv.textContent = `${sessionState.roundQuestion}`;

        questionDiv.hidden = false;
        questionInput.hidden = false;
    } else if(sessionState.roundState == 2){
        phaseInfo.textContent = "Waiting for next round";
        questionInput.hidden = true;
        submitButton.hidden = true;

    }
}

async function submitAnswer() {
  let questionInput = document.getElementById("questionInput");
  const answerText = questionInput.value.trim();

  if (!answerText) {
    alert("Enter an answer.");
    return;
  }

  const params = new URLSearchParams({
    sessionId: sessionStorage.getItem("sessionId") ?? "",
    playerToken: sessionStorage.getItem("playerToken") ?? ""
  });

  try {
    const response = await fetch(`${API_BASE}/api/session/answer?${params}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ submittedAnswer: answerText })
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    questionInput.value = "";
    console.log("sent answer"); // "answered"
  } catch (error) {
    console.error("Could not submit answer:", error);
    alert(`Could not submit answer: ${error.message}`);
  }
}

async function showStatsScreen(state){
  let statScreen = document.getElementById('scoreBoard');
  statScreen.replaceChildren();
  statScreen.hidden = false;

  let playerName = document.createElement('p');
  playerName.textContent = "Name";

  let playerAnswer = document.createElement('p');
  playerAnswer.textContent = "Answer";

  let playerCurrentScoreHeader = document.createElement('p');
  playerCurrentScoreHeader.textContent = "Score";

  statScreen.append(playerName);

  statScreen.append(playerAnswer);

  statScreen.append(playerCurrentScoreHeader);

  let answers = [];

  if(state.roundState == 2){

    const params = new URLSearchParams({
      sessionId: sessionStorage.getItem("sessionId") ?? "",
      playerToken: sessionStorage.getItem("playerToken") ?? ""
    });

    try{
      const response = await fetch(`${API_BASE}/api/session/answer?${params}`);
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      answers = await response.json();

      console.log("Received answers:", answers); // "answered"
    } catch(error) {
      console.error("Could not retrieve answers:", error);
    }
  }

  for(let i = 0; i < state.playerNames.length; i++){
    let currentPlayer = document.createElement('p');
    currentPlayer.textContent = `${state.playerNames[i]}`;

    let playerCurrentAnswer = document.createElement('p');

    if(state.roundState == 2){
      const playerName = state.playerNames[i];

      const matchingAnswer = answers.find(answer =>
          answer.playersThatAnsweredThis.some(player =>
              player.playerName === playerName
          )
      );

      playerCurrentAnswer.textContent =
          matchingAnswer?.submittedAnswer ?? "";
    } else {
      playerCurrentAnswer.textContent = "";

    }

    let playerCurrentScore = document.createElement('p');
    playerCurrentScore.textContent = state.playerScores[i];

    statScreen.append(
      currentPlayer,
      playerCurrentAnswer,
      playerCurrentScore
    );


  }

}
