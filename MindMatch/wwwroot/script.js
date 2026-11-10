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
    joinLobbyText.textContent = 'Join Lobby';
}