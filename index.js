//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.
const API_URL = "https://fsa-puppy-bowl.herokuapp.com/api/2510-Teranae/players";

/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/
let allPlayers = []; //all puppies being stored here ---←←←←←---
let selectedPlayer = null; //user selected click puppy---←←←←←---
////////////////////////////

const form = document.querySelector("#add-player-form");
const container = document.querySelector("#container");
const details = document.querySelector("#details");
/**
 * Fetches all players from the API.
 * This function should not be doing any rendering
 * @returns {Object[]} the array of player objects
 */

//TODO

//Talks to the website (API)
//Waits for the response
//Turns response into a JavaScript object
//Returns ONLY players
//----↓↓↓↓↓↓↓-------

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(API_URL); //gets data
    const data = await response.json(); //turns in JS
    return data.data.players;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// fetchAllPlayers().then((players) => console.log(players));

/**
 * Fetches a single player from the API.
 * This function should not be doing any rendering
 * @param {number} playerId
 * @returns {Object} the player object
 */

//TODO

const fetchSinglePlayer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    return data.data.player;
  } catch (error) {
    console.error(error);
  }
};
// fetchSinglePlayer(46305).then((player) => console.log(player));

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * Do we have a way to do that currently...?
 */
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */

//TODO

const addNewPlayer = async (newPlayer) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST", // we are sending data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer), // convert JS object to JSON string
    });

    const data = await response.json();
    const addedPlayer = data.data.player || data.data;

    if (!addedPlayer) return;

    //  Just add the new one locally (don’t refetch)
    allPlayers.push(addedPlayer);

    //  Re-render so it appears right away
    render();
  } catch (error) {
    console.error("Error adding new player:", error);
  }
};

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() some information is required.
 * Unless we get that information, we cannot call removePlayer()....
 */
/**
 * Note#2: Don't be afraid to add parameters to this function if you need to!
 */

//TODO

const removePlayer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return;

    // Remove from local allPlayers array
    allPlayers = allPlayers.filter((player) => player.id !== id);

    // If this player was selected, clear the detail section
    // if (selectedPlayer && selectedPlayer.id === id) {
    //   selectedPlayer = null;
    //   details.innerHTML = "<p>Select a puppy to see details</p>";
    // }

    // Re-render the roster
    render();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. The page should show
 *    specific details about the player clicked
 * - Remove from roster. when clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */

// TODO

const render = () => {
  container.innerHTML = "";

  if (allPlayers.length === 0) {
    container.innerHTML = "<p>No puppies yet!</p>";
  } else {
    container.innerHTML = allPlayers
      .map(
        (player) => `
      <div class ="player-card" data-id="${player.id}">
        <h3>${player.name}</h3>
        <img src="${player.imageUrl}" alt="${player.name}" />
        <p>ID: ${player.id}</p>
      </div>
    `
      )
      .join("");
  }

  const cards = document.querySelectorAll(".player-card");
  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const playerId = Number(card.dataset.id);
      const fullPlayer = await fetchSinglePlayer(playerId);
      if (fullPlayer) renderSinglePlayer(fullPlayer);
    });
  });
};

const renderSinglePlayer = (player) => {
  // Save the selected player in state
  selectedPlayer = player;

  container.innerHTML = `
    <div class="single-player">
      <h2>${player.name}</h2>
      <img src="${player.imageUrl}" alt="${player.name}">
      <p><strong>ID:</strong> ${player.id}</p>
      <p><strong>Breed:</strong> ${player.breed}</p>
      <p><strong>Status:</strong> ${player.status}</p>
      <p><strong>Team:</strong> ${
        player.team && player.team.name ? player.team.name : "Unassigned"
      }</p>
      <button id="remove-btn">Remove from Roster</button>
      <button id="back-btn">Back to all puppies</button>
    </div>
  `;

  // Remove button
  const removeBtn = document.getElementById("remove-btn");
  removeBtn.addEventListener("click", async () => {
    await removePlayer(player.id);
  });

  // Back button
  const backBtn = document.getElementById("back-btn");
  backBtn.addEventListener("click", () => {
    selectedPlayer = null; // clear selection
    render(); // show all players again
  });
};

const setupForm = () => {
  const form = document.getElementById("add-player-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop page refresh

    const formData = new FormData(form);

    const newPlayer = {
      name: formData.get("name"),
      breed: formData.get("breed"),
    };

    await addNewPlayer(newPlayer);

    form.reset(); // clears the input fields
  });
};

/**
 * Initializes the app by calling render
 * HOWEVER....
 */
const init = async () => {
  console.log("Container:", container);
  allPlayers = await fetchAllPlayers();
  console.log("All players:", allPlayers);
  setupForm(); //Before we render, what do we always need...?
  render();
};

init();
