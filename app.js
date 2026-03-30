const LIMIT = 151;
const CONCURRENCY = 12; // Keep requests reasonable while loading 151 Pokémon.

function $id(id) {
  return document.getElementById(id);
}

function capitalize(s) {
  if (!s) return "";
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

function typeBadges(types) {
  return types.map((t) => capitalize(t)).join(", ");
}

function formatPokeId(id) {
  var s = String(id);
  while (s.length < 3) s = "0" + s;
  return s;
}

function renderPokemonCard(pokemon, onClick) {
  // pokemon is the details payload from /pokemon/{id}
  const id = pokemon.id;
  const name = pokemon.name;

  var types = [];
  if (pokemon.types && pokemon.types.length) {
    for (var i = 0; i < pokemon.types.length && types.length < 2; i++) {
      var typeObj = pokemon.types[i].type;
      if (typeObj && typeObj.name) types.push(typeObj.name);
    }
  }

  const card = document.createElement("article");
  card.className = "card";
  card.setAttribute("aria-label", "Open details for " + name);
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");

  card.addEventListener("click", function () {
    onClick(pokemon);
  });

  const idEl = document.createElement("div");
  idEl.className = "pokemon-id";
  idEl.textContent = "#" + formatPokeId(id);

  const nameEl = document.createElement("h3");
  nameEl.className = "pokemon-name";
  nameEl.textContent = capitalize(name);

  const imgWrap = document.createElement("div");
  const img = document.createElement("img");
  img.alt = name;

  var frontDefault = "";
  if (pokemon.sprites) {
    if (
      pokemon.sprites.other &&
      pokemon.sprites.other["official-artwork"] &&
      pokemon.sprites.other["official-artwork"].front_default
    ) {
      frontDefault = pokemon.sprites.other["official-artwork"].front_default;
    } else if (pokemon.sprites.front_default) {
      frontDefault = pokemon.sprites.front_default;
    }
  }
  img.src = frontDefault;

  imgWrap.appendChild(img);

  const typesEl = document.createElement("p");
  typesEl.className = "pokemon-types";
  typesEl.textContent = "Types: " + typeBadges(types);

  card.appendChild(idEl);
  card.appendChild(nameEl);
  card.appendChild(imgWrap);
  card.appendChild(typesEl);

  return card;
}

async function populateDescriptionForId(id) {
  try {
    const species = await window.api.fetchPokemonSpeciesById(id);
    const text = window.api.extractEnglishFlavorText(species);
    $id("details-description").textContent = text ? text : "No description available.";
  } catch {
    $id("details-description").textContent = "Failed to load description.";
  }
}

function showBaseStats(details) {
  const wanted = ["hp", "attack", "defense", "speed"];
  const stats = details.stats || [];
  const body = $id("details-stats-body");
  body.innerHTML = "";

  for (const key of wanted) {
    const stat = stats.find((s) => s.stat && s.stat.name === key);
    const tr = document.createElement("tr");

    const tdStat = document.createElement("td");
    tdStat.textContent = key.toUpperCase();

    const tdValue = document.createElement("td");
    tdValue.textContent = stat && typeof stat.base_stat === "number" ? stat.base_stat : "-";

    tr.appendChild(tdStat);
    tr.appendChild(tdValue);
    body.appendChild(tr);
  }
}

async function openDetails(pokemon) {
  const id = pokemon.id;
  const name = pokemon.name;
  var types = [];
  if (pokemon.types && pokemon.types.length) {
    for (var i = 0; i < pokemon.types.length; i++) {
      var typeObj = pokemon.types[i].type;
      if (typeObj && typeObj.name) types.push(typeObj.name);
    }
  }

  var abilities = [];
  if (pokemon.abilities && pokemon.abilities.length) {
    for (var j = 0; j < pokemon.abilities.length; j++) {
      var abilityObj = pokemon.abilities[j].ability;
      if (abilityObj && abilityObj.name) abilities.push(abilityObj.name);
    }
  }

  $id("details-name").textContent = capitalize(name);
  $id("details-id").textContent = "#" + formatPokeId(id);

  var frontDefault = "";
  if (pokemon.sprites) {
    if (
      pokemon.sprites.other &&
      pokemon.sprites.other["official-artwork"] &&
      pokemon.sprites.other["official-artwork"].front_default
    ) {
      frontDefault = pokemon.sprites.other["official-artwork"].front_default;
    } else if (pokemon.sprites.front_default) {
      frontDefault = pokemon.sprites.front_default;
    }
  }
  $id("details-img").src = frontDefault;
  $id("details-img").alt = name;

  $id("details-types").textContent = types.length ? typeBadges(types) : "-";
  $id("details-abilities").textContent = abilities.length ? abilities.map(capitalize).join(", ") : "-";

  showBaseStats(pokemon);

  $id("details-description").textContent = "Loading description...";
  $id("details-body").removeAttribute("hidden");
  $id("details-empty").setAttribute("hidden", "");

  await populateDescriptionForId(id);
}

async function loadPokemon() {
  const grid = $id("pokemon-grid");
  const loading = $id("loading");
  const error = $id("error");

  loading.removeAttribute("hidden");
  error.setAttribute("hidden", "");
  grid.innerHTML = "";

  const list = await window.api.fetchPokemonList(LIMIT);
  const ids = list
    .map((p) => window.api.getIdFromPokemonUrl(p.url))
    .filter((n) => Number.isFinite(n))
    .slice(0, LIMIT);

  const detailsById = new Map();
  let index = 0;

  async function worker() {
    while (index < ids.length) {
      const myIndex = index++;
      const id = ids[myIndex];
      const details = await window.api.fetchPokemonDetailsById(id);
      detailsById.set(id, details);
    }
  }

  async function runWorkers() {
    const workers = [];
    const count = Math.min(CONCURRENCY, ids.length);
    for (let i = 0; i < count; i++) workers.push(worker());
    await Promise.all(workers);
  }

  return { ids, detailsById, runWorkers };
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = $id("pokemon-grid");
  const loading = $id("loading");
  const error = $id("error");

  // Start load
  try {
    const { ids, detailsById, runWorkers } = await loadPokemon();
    await runWorkers();

    // Render after all data is loaded so the grid is stable by ID.
    ids.sort(function (a, b) {
      return a - b;
    });
    for (const id of ids) {
      const details = detailsById.get(id);
      if (details) grid.appendChild(renderPokemonCard(details, openDetails));
    }

    loading.setAttribute("hidden", "");
  } catch (e) {
    loading.setAttribute("hidden", "");
    error.removeAttribute("hidden");
    var msg = "";
    if (e && e.message) msg = "(" + e.message + ")";
    error.textContent = "Failed to load Pokédex. " + msg;
    // Keep grid empty; user can refresh.
    grid.innerHTML = "";
  }
});

