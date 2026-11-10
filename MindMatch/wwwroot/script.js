const joinedMatch = false;
const sessionId = false;
const playerToken = "";

document.addEventListener("DOMContentLoaded", () => {
    if(joinedMatch == false){
        CreateStartScreen();
        return;
    }
});

const playField = document.getElementById('playField');

function CreateStartScreen(){
    let joinLobbyText = document.createElement('h2');
    joinLobbyText.textContent = 'Join Room';
    joinLobbyText.classList.add('centeredObject');

    let roomCodeInput = document.createElement('input');
    roomCodeInput.classList.add('centeredObject');

    let createLobbyText = document.createElement('h3');
    createLobbyText.textContent = 'Create Room';
    createLobbyText.classList.add('centeredObject');

    
    playField.append(joinLobbyText);

    playField.append(roomCodeInput);

    playField.append(createLobbyText);

}