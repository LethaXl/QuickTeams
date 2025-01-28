let players = [];
let goalkeepers = [];
let playersInTeamA = [];
let playersInTeamB = [];
let selectedPlayerA = null;
let selectedPlayerB = null;

function toggleGoalkeeperInputs() {
    const hasGoalkeeper = document.querySelector("#goalkeeperToggle .checkbox").checked;
    document.getElementById("goalkeeperInputs").style.display = hasGoalkeeper ? "block" : "none";
    document.getElementById("goalkeeperDisplaySection").style.display = goalkeepers.length > 0 ? "block" : "none";
    if (!hasGoalkeeper) {
        clearGoalkeepers();
    }
}

function addGoalkeepers() {
    const keeperName = document.getElementById("goalkeeperName").value.trim();
    if (keeperName && goalkeepers.length < 2) {
        if (!goalkeepers.includes(keeperName)) {
            goalkeepers.push(keeperName);
            updateGoalkeeperList();
        } else {
            alert(`${keeperName} is already in the goalkeeper list.`);
        }
    } else if (goalkeepers.length >= 2) {
        alert("You can only add up to 2 goalkeepers.");
    }
    document.getElementById("goalkeeperName").value = "";
}

function clearGoalkeepers() {
    goalkeepers = [];
    updateGoalkeeperList();
}

function updateGoalkeeperList() {
    const goalkeeperListDiv = document.getElementById("goalkeeperList");
    goalkeeperListDiv.innerHTML = "";
    goalkeepers.forEach((keeper, index) => {
        const keeperItemDiv = document.createElement("div");
        keeperItemDiv.className = "goalkeeper-item";
        keeperItemDiv.textContent = keeper;
        const removeButtonGK = document.createElement("span");
        removeButtonGK.innerHTML = "&#10006;";
        removeButtonGK.style.color = "red";
        removeButtonGK.style.cursor = "pointer";
        removeButtonGK.onclick = () => removeGoalkeeper(index);
        keeperItemDiv.appendChild(removeButtonGK);
        goalkeeperListDiv.appendChild(keeperItemDiv);
    });
    document.getElementById("goalkeeperDisplaySection").style.display = goalkeepers.length > 0 ? "block" : "none";
}

function removeGoalkeeper(index) {
    goalkeepers.splice(index, 1);
    updateGoalkeeperList();
}

function addPlayer() {
    const playerNames = document.getElementById("playerName").value.trim();
    const maxPlayers = goalkeepers.length === 2 ? 12 : 14;
    const namesArray = playerNames.split(",").map(name => name.trim()).filter(name => name !== "");
    namesArray.forEach(playerName => {
        if (playerName && players.length < maxPlayers) {
            if (!players.includes(playerName)) {
                players.push(playerName);
            } else {
                alert(`${playerName} is already in the player list.`);
            }
        } else if (players.length >= maxPlayers) {
            alert(`You have reached the maximum limit of ${maxPlayers} players.`);
        }
    });
    updatePlayerList();
    document.getElementById("playerName").value = "";
}

function clearPlayers() {
    players = [];
    updatePlayerList();
    document.getElementById("playerName").value = "";
}

function updatePlayerList() {
    const playerListDiv = document.getElementById("playerList");
    const playerSection = playerListDiv.parentElement;
    playerListDiv.innerHTML = "";
    players.forEach((player, index) => {
        const playerItemDiv = document.createElement("div");
        playerItemDiv.className = "player-item";
        playerItemDiv.textContent = player;
        const removeIcon = document.createElement("span");
        removeIcon.innerHTML = "&#10006;";
        removeIcon.style.color = "red";
        removeIcon.style.cursor = "pointer";
        removeIcon.onclick = () => removePlayer(index);
        playerItemDiv.appendChild(removeIcon);
        playerListDiv.appendChild(playerItemDiv);
    });
    playerSection.style.display = players.length > 0 ? "block" : "none";
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
}

function generateTeams() {
    if (players.length < 2) {
        alert("You need at least 2 players to form teams!");
        return;
    }
    const shuffled = players.sort(() => 0.5 - Math.random());
    playersInTeamA = [];
    playersInTeamB = [];
    let keeperA = null;
    let keeperB = null;
    if (goalkeepers.length > 0) {
        keeperA = goalkeepers[0];
        playersInTeamA.push(keeperA);
    }
    if (goalkeepers.length > 1) {
        keeperB = goalkeepers[1];
        playersInTeamB.push(keeperB);
    }
    shuffled.forEach((player, index) => {
        if (index % 2 === 0) {
            playersInTeamA.push(player);
        } else {
            playersInTeamB.push(player);
        }
    });
    displayTeams(playersInTeamA, playersInTeamB);
}

function displayTeams(teamA, teamB) {
    const teamADiv = document.getElementById('teamA');
    const teamBDiv = document.getElementById('teamB');
    teamADiv.innerHTML = "";
    teamBDiv.innerHTML = "";
    teamA.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.textContent = player;
        playerDiv.style.cursor = "pointer";
        playerDiv.onclick = () => selectPlayer('A', player);
        teamADiv.appendChild(playerDiv);
    });
    teamB.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.textContent = player;
        playerDiv.style.cursor = "pointer";
        playerDiv.onclick = () => selectPlayer('B', player);
        teamBDiv.appendChild(playerDiv);
    });
}

function selectPlayer(team, player) {
    if (team === 'A') {
        if (selectedPlayerA === player) {
            selectedPlayerA = null;
            document.getElementById('selectedPlayerA').textContent = "None";
            removeArrowAnimation('teamA', player);
        } else {
            selectedPlayerA = player;
            document.getElementById('selectedPlayerA').textContent = player;
            highlightSelectedPlayer('teamA', player);
        }
    } else {
        if (selectedPlayerB === player) {
            selectedPlayerB = null;
            document.getElementById('selectedPlayerB').textContent = "None";
            removeArrowAnimation('teamB', player);
        } else {
            selectedPlayerB = player;
            document.getElementById('selectedPlayerB').textContent = player;
            highlightSelectedPlayer('teamB', player);
        }
    }
}

function highlightSelectedPlayer(teamId, player) {
    const teamDiv = document.getElementById(teamId);
    Array.from(teamDiv.children).forEach(child => {
        if (child.textContent === player) {
            addArrowAnimation($(child), teamId === 'teamA' ? 'A' : 'B');
        } else {
            $(child).find('.arrowL, .arrowR').remove();
        }
    });
}

function addArrowAnimation(playerDiv, team) {
    playerDiv.find('.arrowL, .arrowR').remove();
    const arrowDiv = $('<div>', { class: team === 'A' ? 'arrowL' : 'arrowR' });
    const span1 = $('<span>');
    const span2 = $('<span>');
    const span3 = $('<span>');
    arrowDiv.append(span1, span2, span3);
    playerDiv.css('position', 'relative');
    if (team === 'A') {
        arrowDiv.css({ position: 'absolute', right: '-25px', top: '50%', transform: 'translateY(-50%)' });
    } else if (team === 'B') {
        arrowDiv.css({ position: 'absolute', left: '-25px', top: '50%', transform: 'translateY(-50%)' });
    }
    playerDiv.append(arrowDiv);
}

function removeArrowAnimation(teamId, player) {
    const teamDiv = document.getElementById(teamId);
    Array.from(teamDiv.children).forEach(child => {
        if (child.textContent === player) {
            $(child).find('.arrowL, .arrowR').remove();
        }
    });
}

function swapPlayers() {
    if (!selectedPlayerA || !selectedPlayerB) {
        alert("Select a player on either team");
        return;
    }
    const indexA = playersInTeamA.indexOf(selectedPlayerA);
    const indexB = playersInTeamB.indexOf(selectedPlayerB);
    if (indexA !== -1 && indexB !== -1) {
        playersInTeamA[indexA] = selectedPlayerB;
        playersInTeamB[indexB] = selectedPlayerA;
        selectedPlayerA = null;
        selectedPlayerB = null;
        document.getElementById('selectedPlayerA').textContent = "None";
        document.getElementById('selectedPlayerB').textContent = "None";
        displayTeams(playersInTeamA, playersInTeamB);
    }
}

function clearTeams() {
    document.getElementById('teamA').innerHTML = "";
    document.getElementById('teamB').innerHTML = "";
}

document.getElementById("swapStartButton").onclick = swapPlayers;

document.querySelectorAll("#clearTeam, #generateTeams, #swapStartButton").forEach((button) => {
    button.addEventListener("click", () => {
        button.blur(); // Removes focus after clicking
    });
});


const titleElement = document.getElementById('scramble-title');
const originalText = titleElement.textContent;
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const scrambleDuration = 3000;
const scrambleInterval = 150;
let currentText = '';
let step = 0;

function scrambleText() {
    if (step < scrambleDuration / scrambleInterval) {
        const scrambledText = Array.from(originalText).map((char, index) => {
            if (index < step) return char;
            return letters.charAt(Math.floor(Math.random() * letters.length));
        }).join('');
        titleElement.textContent = scrambledText;
        step++;
        setTimeout(scrambleText, scrambleInterval);
    } else {
        titleElement.textContent = originalText;
    }
}

function hidePlayerSectionIfEmpty() {
    const playerSection = document.getElementById("playerList").parentElement;
    playerSection.style.display = players.length > 0 ? "block" : "none";
}

window.onload = function() {
    scrambleText();
    hidePlayerSectionIfEmpty();
};
