var firebaseConfig = {
  apiKey: "AIzaSyBJfl0mgwAa25_4NEAJBJ6VEmkcuI6KkbA",
  authDomain: "number-game-338f5.firebaseapp.com",
  databaseURL: "https://number-game-338f5-default-rtdb.firebaseio.com/",
  projectId: "number-game-338f5",
  storageBucket: "number-game-338f5.appspot.com",
  messagingSenderId: "789630805302",
  appId: "1:789630805302:web:f9a5c06f2f80cf7efcbf97",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let playerID;
let gameStarted = false;

function startGame() {
  db.ref("game")
    .set({
      started: true,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    })
    .then(() => {
      playerID = Date.now().toString();
      gameStarted = true;
      db.ref("players").set(null);
      resetUI();
    });
}

function submitChoice() {
  if (!gameStarted) {
    alert("Please start a new game first!");
    return;
  }
  let selectedNumber = document.getElementById("numberChoice").value;
  db.ref("players/" + playerID)
    .set({
      number: selectedNumber,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    })
    .then(() => {
      document.getElementById("status").textContent =
        "Submitted. Waiting for other player...";
      document.querySelector("button").disabled = true;
    })
    .catch((error) => {
      console.error("Error submitting choice: ", error);
    });
}

db.ref("players").on("value", function (snapshot) {
  let players = snapshot.val();
  if (players) {
    let playerIDs = Object.keys(players);
    if (playerIDs.length === 2 && playerIDs.includes(playerID)) {
      let allSubmitted = playerIDs.every((id) =>
        players[id].hasOwnProperty("number")
      );
      if (allSubmitted) {
        let results = "";
        playerIDs.forEach((id) => {
          if (id === playerID) {
            results += "You chose: " + players[id].number + "<br>";
          } else {
            results += "Other player chose: " + players[id].number + "<br>";
          }
        });
        document.getElementById("results").innerHTML = results;
        document.getElementById("status").textContent = "";
      }
    } else if (playerIDs.length > 2) {
    } else if (playerIDs.length === 1 && playerIDs.includes(playerID)) {
    }
  } else if (!players && gameStarted) {
  }
});

// Resets the UI for a new game
function resetUI() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("status").textContent =
    "Game started. Please submit your number.";
  document.querySelector("button").disabled = false; // Re-enable the submit button
}

// Function to start a new game and reset the database
function startGame() {
  playerID = Date.now().toString();
  gameStarted = true;
  db.ref("players").set(null);
  resetUI();
}
