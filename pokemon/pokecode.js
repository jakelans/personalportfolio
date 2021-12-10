import { removeChildren } from "../utils/index.js";

function getAPIData(url) {
  try {
    return fetch(url).then((data) => data.json());
  } catch (error) {
    console.error(error);
  }
}

const searchPokemon = document.querySelector(".searchPokemon");
searchPokemon.addEventListener("click", () => {
  let promptResult = prompt("Enter a Pokemon name (All lowercase) or ID");
  getAPIData(`https://pokeapi.co/api/v2/pokemon/${promptResult}`).then(
    (pokesearch) => populatePokeCard(pokesearch)
  );
});

function loadPokemon(offset = 0, limit = 25) {
  removeChildren(pokeGrid);
  getAPIData(
    `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
  ).then(async (data) => {
    for (const pokemon of data.results) {
      await getAPIData(pokemon.url).then((pokeData) =>
        populatePokeCard(pokeData)
      );
    }
  });
}
const pokeGrid = document.querySelector(".pokeGrid");
// const loadButton = document.querySelector('.loadPokemon')
// loadButton.addEventListener('click', () => {
//   removeChildren(pokeGrid)
loadPokemon();

const newButton = document.querySelector(".newPokemon");
newButton.addEventListener("click", () => {
  let pokeName = prompt("What is the name of your new Pokemon?");
  let pokeHeight = prompt("What is the height of your Pokemon?");
  let pokeWeight = prompt("What is the weight of your pokemon?");
  let pokeAbilities = prompt(
    "What are your Pokemon abilities? (use a comma separated list)"
  );
  let pokeTypes = prompt(
    "What are your pokemon types?(Use spaces and no capital letters)"
  );
  let newPokemon = new Pokemon(
    pokeName,
    pokeHeight,
    pokeWeight,
    getAbilitiesArray(pokeAbilities),
    getTypesArray(pokeTypes)
  );
  console.log(newPokemon);
  populatePokeCard(newPokemon);
});

const morePokemon = document.querySelector(".morePokemon");
morePokemon.addEventListener("click", () => {
  let startPoint = prompt("Which pokemon ID do we start with?");
  let howMany = prompt("How many more Pokemon do you want to see?");
  loadPokemon(startPoint - 1, howMany);
});

function getAbilitiesArray(commaString) {
  let tempArray = commaString.split(",");
  console.log(tempArray);
  return tempArray.map((abilityName) => {
    return {
      ability: {
        name: abilityName,
      },
    };
  });
}

function getTypesArray(spacedString) {
  let tempArray = spacedString.split(" ");
  return tempArray.map((typeName) => {
    return {
      type: {
        name: typeName,
      },
    };
  });
}

function populatePokeCard(singlePokemon) {
  const pokeScene = document.createElement("div");
  pokeScene.className = "scene";
  const pokeCard = document.createElement("div");
  pokeCard.className = "card";
  pokeCard.addEventListener("click", () =>
    pokeCard.classList.toggle("is-flipped")
  );
  const front = populateCardFront(singlePokemon);
  const back = populateCardBack(singlePokemon);

  pokeCard.appendChild(front);
  pokeCard.appendChild(back);
  pokeScene.appendChild(pokeCard);
  pokeGrid.appendChild(pokeScene);
}

function populateCardFront(pokemon) {
  const pokeFront = document.createElement("figure");
  pokeFront.className = "cardFace front";
  const pokeImg = document.createElement("img");
  if (pokemon.id === 9001) {
    pokeImg.src = "../images/createpokeball.png";
  } else {
    pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  }
  const pokeCaption = document.createElement("figcaption");
  pokeCaption.textContent = `${pokemon.name}`;
  pokeFront.appendChild(pokeImg);
  pokeFront.appendChild(pokeCaption);

  pokeFront.addEventListener("mouseover", () =>
    typesBackground(pokemon, pokeFront)
  );
  pokeFront.addEventListener(
    "mouseleave",
    () => (pokeFront.style.background = "rgb(118, 99, 182)")
  );
  return pokeFront;
}

function typesBackground(pokemon, card) {
  let pokeType1 = pokemon.types[0].type.name;
  let pokeType2 = pokemon.types[1]?.type.name;
  if (!pokeType2) {
    card.style.setProperty("background", getPokeTypeColor(pokeType1));
  } else {
    card.style.setProperty(
      "background",
      `linear-gradient(${getPokeTypeColor(pokeType1)}, ${getPokeTypeColor(
        pokeType2
      )})`
    );
  }
}

function populateCardBack(pokemon) {
  const pokeBack = document.createElement("div");
  pokeBack.className = "cardFace back";
  const pokeId = document.createElement("p");
  pokeId.textContent = `ID# ${pokemon.id}`;
  const pokeImgBack = document.createElement("img");
  if (pokemon.id === 9001) {
    pokeImgBack.src = "../images/pokeball8bit.png";
  } else {
    pokeImgBack.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }
  const pokeHeight = document.createElement("h4");
  pokeHeight.textContent = "Height/Weight:";
  const height = document.createElement("p");
  height.textContent = `${pokemon.height}/${pokemon.weight}`;
  const label = document.createElement("h4");
  label.textContent = "Abilities:";
  const abilityList = document.createElement("ul");
  pokemon.abilities.forEach((ability) => {
    let abilityItem = document.createElement("li");
    abilityItem.textContent = ability.ability.name;
    abilityList.appendChild(abilityItem);
    pokeBack.appendChild(pokeImgBack);
  });
  const types = document.createElement("h4");
  types.textContent = "Type(s)";
  const pokeTypes = document.createElement("ul");
  pokemon.types.forEach((pokeType) => {
    let typeItem = document.createElement("li");
    typeItem.textContent = pokeType.type.name;
    pokeTypes.appendChild(typeItem);
  });
  pokeBack.appendChild(pokeId);
  pokeBack.appendChild(pokeHeight);
  pokeBack.appendChild(height);
  pokeBack.appendChild(label);
  pokeBack.appendChild(abilityList);
  pokeBack.appendChild(types);
  pokeBack.appendChild(pokeTypes);

  typesBackground(pokemon, pokeBack);

  return pokeBack;
}

class Pokemon {
  constructor(name, height, weight, abilities, types) {
    (this.id = 9001),
      (this.name = name),
      (this.height = height),
      (this.weight = weight),
      (this.abilities = abilities),
      (this.types = types);
  }
}

function getPokeTypeColor(pokeType) {
  let color;
  switch (pokeType) {
    case "grass":
      color = "#2f8f00";
      break;
    case "fire":
      color = "#FF4C01";
      break;
    case "water":
      color = "#0090ff";
      break;
    case "bug":
      color = "#7fff00";
      break;
    case "normal":
      color = "#E9D2A4";
      break;
    case "flying":
      color = "#88FEFF";
      break;
    case "poison":
      color = "#CE87FF";
      break;
    case "electric":
      color = "#CFE600";
      break;
    case "psychic":
      color = "#e96c95";
      break;
    case "ground":
      color = "#e0c068";
      break;
    case "rock":
      color = "#b8a038";
      break;
    case "dragon":
      color = "#7038f8";
      break;
    case "ghost":
      color = "#785898";
      break;
    case "fairy":
      color = "#ee99ac";
      break;
    case "ice":
      color = "#98d8d8";
      break;
    case "fighting":
      color = "#c03028";
      break;
    case "dark":
      color = "#705746";
      break;
    case "steel":
      color = "#b7b7ce";
      break;
    default:
      color = "#999999";
  }
  return color;
}
