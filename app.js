var LIMIT = 151;
var CONCURRENCY = 12;
var allPokemon = [];
var favorites = [];
var currentSelectedPokemon = null;
var currentFilter = "all";
var currentSort = "id-asc";
var searchTerm = "";
var currentTab = "home";
function $id(id) {
  return document.getElementById(id);
}
function capitalize(s) {
  if (!s) {
    return "";
  }
  return s[0].toUpperCase() + s.slice(1);
}
function typeBadges(types) {
  return types.map(function(type) {
    return capitalize(type);
  }).join(", ");
}
function formatPokeId(id) {
  var s = String(id);
  while (s.length < 3) {
    s = "0" + s;
  }
  return s;
}
function switchTab(tabName) {
  currentTab = tabName;

  document.querySelectorAll(".tab-content").forEach(function(tab) {
    tab.classList.remove("active");
  });

  // Keep the landing/home content visible while "Explore" is selected.
  if (tabName === "explore") {
    var homeTab = document.getElementById("home-tab");
    if (homeTab) homeTab.classList.add("active");
  }

  var selectedTab = document.getElementById(tabName + "-tab");
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(function(btn) {
    btn.classList.remove("active");
  });
  document.querySelector('[data-tab="' + tabName + '"]').classList.add("active");

  if (tabName === "favorites") {
    renderFavoritesGrid();
  }
}



function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
  updateThemeToggleText();
}

function updateThemeToggleText() {
  var btn = $id("theme-toggle");
  if (!btn) return;
  btn.textContent = document.body.classList.contains("light-mode") ? "🌙" : "☀️";
}

function initializeTheme() {
  var savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
  updateThemeToggleText();
}



function addFavorite(pokemon) {
  if (!favorites.find(function(p) {
    return p.id === pokemon.id;
  })) {
    favorites.push(pokemon);
    saveFavorites();
    updateFavoriteCount();
  }
}

function removeFavorite(pokemonId) {
  favorites = favorites.filter(function(p) {
    return p.id !== pokemonId;
  });
  saveFavorites();
  updateFavoriteCount();
}

function toggleFavorite(pokemon) {
  if (favorites.find(function(p) {
    return p.id === pokemon.id;
  })) {
    removeFavorite(pokemon.id);
  } else {
    addFavorite(pokemon);
  }
}

function isFavorited(pokemonId) {
  return favorites.some(function(p) {
    return p.id === pokemonId;
  });
}

function saveFavorites() {
  var favoriteIds = favorites.map(function(p) {
    return p.id;
  });
  localStorage.setItem("favorites", JSON.stringify(favoriteIds));
}

function loadFavorites() {
  var saved = localStorage.getItem("favorites");
  if (saved) {
    var favoriteIds = JSON.parse(saved);
    favorites = allPokemon.filter(function(p) {
      return favoriteIds.includes(p.id);
    });
  }
}

function updateFavoriteCount() {
  var elem = $id("favorite-count");
  if (elem) {
    elem.textContent = favorites.length;
  }
  updateStats();
}



function initializeTypeFilters() {
  var typeFilter = $id("type-filter");
  var types = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

  types.forEach(function(type) {
    var btn = document.createElement("button");
    btn.className = "type-btn";
    btn.textContent = capitalize(type);
    btn.setAttribute("data-type", type);
    btn.addEventListener("click", function() {
      setTypeFilter(type);
    });
    typeFilter.appendChild(btn);
  });

  document.querySelector('[data-type="all"]').classList.add("active");
}

function setTypeFilter(type) {
  currentFilter = type;

  document.querySelectorAll(".type-btn").forEach(function(btn) {
    btn.classList.remove("active");
  });
  document.querySelector('[data-type="' + type + '"]').classList.add("active");

  renderFiltered();
}

function resetFilters() {
  searchTerm = "";
  currentSort = "id-asc";
  currentFilter = "all";

  var searchInput = $id("search-input");
  if (searchInput) searchInput.value = "";

  var sortSelect = $id("sort-select");
  if (sortSelect) sortSelect.value = currentSort;

  document.querySelectorAll(".type-btn").forEach(function(btn) {
    btn.classList.remove("active");
  });
  var allBtn = document.querySelector('[data-type="all"]');
  if (allBtn) allBtn.classList.add("active");

  renderFiltered();
}

function filterByType(pokemonList, type) {
  if (type === "all") {
    return pokemonList;
  }
  return pokemonList.filter(function(pokemon) {
    return pokemon.types && pokemon.types.some(function(typeObj) {
      return typeObj.type && typeObj.type.name === type;
    });
  });
}

function searchPokemon(pokemonList, query) {
  if (!query) {
    return pokemonList;
  }
  var lowerQuery = query.toLowerCase();
  return pokemonList.filter(function(pokemon) {
    return pokemon.name.toLowerCase().includes(lowerQuery) ||
           String(pokemon.id).includes(query);
  });
}

function sortPokemon(pokemonList, sortOption) {
  var sorted = pokemonList.slice(); // Create a copy

  switch (sortOption) {
    case "id-asc":
      return sorted.sort(function(a, b) {
        return a.id - b.id;
      });
    case "id-desc":
      return sorted.sort(function(a, b) {
        return b.id - a.id;
      });
    case "name-asc":
      return sorted.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
    case "name-desc":
      return sorted.sort(function(a, b) {
        return b.name.localeCompare(a.name);
      });
    default:
      return sorted;
  }
}

function getFilteredAndSortedPokemon() {
  var result = searchPokemon(allPokemon, searchTerm);
  result = filterByType(result, currentFilter);
  result = sortPokemon(result, currentSort);
  return result;
}



function renderPokemonCard(pokemon, onClick) {
  var id = pokemon.id;
  var name = pokemon.name;
  var types = [];

  if (pokemon.types) {
    pokemon.types.slice(0, 2).forEach(function(typeObj) {
      if (typeObj.type && typeObj.type.name) {
        types.push(typeObj.type.name);
      }
    });
  }

  var card = document.createElement("article");
  card.className = "card";
  card.setAttribute("aria-label", "Open details for " + name);
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");

  card.addEventListener("click", function() {
    onClick(pokemon);
    showDetailsModal(pokemon);
  });

  card.addEventListener("mouseenter", function() {
    showDetailsModal(pokemon);
  });

  var favBtn = document.createElement("button");
  favBtn.className = "card-favorite";
  if (isFavorited(id)) {
    favBtn.classList.add("favorited");
  }
  favBtn.textContent = isFavorited(id) ? "♥" : "♡";
  favBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleFavorite(pokemon);
    favBtn.classList.toggle("favorited");
    favBtn.textContent = isFavorited(id) ? "♥" : "♡";
  });
  card.appendChild(favBtn);

  var idEl = document.createElement("div");
  idEl.className = "pokemon-id";
  idEl.textContent = "#" + formatPokeId(id);

  var nameEl = document.createElement("h3");
  nameEl.className = "pokemon-name";
  nameEl.textContent = capitalize(name);

  var imgWrap = document.createElement("div");
  var img = document.createElement("img");
  img.alt = name;

  var pic = "";
  if (pokemon.sprites) {
    if (pokemon.sprites.other && pokemon.sprites.other["official-artwork"] && pokemon.sprites.other["official-artwork"].front_default) {
      pic = pokemon.sprites.other["official-artwork"].front_default;
    } else if (pokemon.sprites.front_default) {
      pic = pokemon.sprites.front_default;
    }
  }

  img.src = pic;
  imgWrap.appendChild(img);

  var typesEl = document.createElement("p");
  typesEl.className = "pokemon-types";
  typesEl.textContent = "Types: " + typeBadges(types);

  card.appendChild(idEl);
  card.appendChild(nameEl);
  card.appendChild(imgWrap);
  card.appendChild(typesEl);

  return card;
}

async function populateDescriptionForId(id) {
  var desc = $id("details-description");
  if (!desc) return;

  try {
    var species = await window.api.fetchPokemonSpeciesById(id);
    var text = window.api.extractEnglishFlavorText(species);

    if (text) {
      desc.textContent = text;
    } else {
      desc.textContent = "No description available.";
    }
  } catch (e) {
    desc.textContent = "Failed to load description.";
  }
}

function showBaseStats(details) {
  var wanted = ["hp", "attack", "defense", "speed"];
  var stats = details.stats || [];
  var body = $id("details-stats-body");
  body.innerHTML = "";

  wanted.forEach(function(key) {
    var stat = stats.find(function(s) {
      return s.stat && s.stat.name === key;
    });
    var value = stat ? stat.base_stat : "-";

    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.textContent = key.toUpperCase();

    var td2 = document.createElement("td");
    td2.textContent = value;

    tr.appendChild(td1);
    tr.appendChild(td2);
    body.appendChild(tr);
  });
}



async function openDetails(pokemon) {
  currentSelectedPokemon = pokemon;
  var id = pokemon.id;
  var name = pokemon.name;
  var types = [];
  var abilities = [];

  if (pokemon.types) {
    pokemon.types.forEach(function(typeObj) {
      if (typeObj.type && typeObj.type.name) {
        types.push(typeObj.type.name);
      }
    });
  }

  if (pokemon.abilities) {
    pokemon.abilities.forEach(function(abilityObj) {
      if (abilityObj.ability && abilityObj.ability.name) {
        abilities.push(abilityObj.ability.name);
      }
    });
  }

  $id("details-name").textContent = capitalize(name);
  $id("details-id").textContent = "#" + formatPokeId(id);

  var pic = "";
  if (pokemon.sprites) {
    if (pokemon.sprites.other && pokemon.sprites.other["official-artwork"] && pokemon.sprites.other["official-artwork"].front_default) {
      pic = pokemon.sprites.other["official-artwork"].front_default;
    } else if (pokemon.sprites.front_default) {
      pic = pokemon.sprites.front_default;
    }
  }

  $id("details-img").src = pic;
  $id("details-img").alt = name;

  if (types.length > 0) {
    $id("details-types").textContent = typeBadges(types);
  } else {
    $id("details-types").textContent = "-";
  }

  if (abilities.length > 0) {
    $id("details-abilities").textContent = abilities.map(capitalize).join(", ");
  } else {
    $id("details-abilities").textContent = "-";
  }

  showBaseStats(pokemon);

  var descEl = $id("details-description");
  if (descEl) {
    descEl.textContent = "Loading description...";
  }

  var detailsBody = $id("details-body");
  if (detailsBody) {
    detailsBody.removeAttribute("hidden");
  }

  var detailsEmpty = $id("details-empty");
  if (detailsEmpty) {
    detailsEmpty.setAttribute("hidden", "");
  }

  var detailsFavBtn = $id("details-favorite-btn");
  if (isFavorited(id)) {
    detailsFavBtn.classList.add("favorited");
    detailsFavBtn.textContent = "♥";
  } else {
    detailsFavBtn.classList.remove("favorited");
    detailsFavBtn.textContent = "♡";
  }

  await populateDescriptionForId(id);
}



function showDetailsModal(pokemon) {
  openDetails(pokemon);
  var modal = $id("details-modal");
  modal.classList.add("active");
  modal.removeAttribute("hidden");
}

function hideDetailsModal() {
  var modal = $id("details-modal");
  modal.classList.remove("active");
  modal.setAttribute("hidden", "");
}



function renderFiltered() {
  var grid = $id("pokemon-grid");
  grid.innerHTML = "";

  var filtered = getFilteredAndSortedPokemon();

  if (filtered.length === 0) {
    $id("no-results").removeAttribute("hidden");
    grid.innerHTML = "";
  } else {
    $id("no-results").setAttribute("hidden", "");
    filtered.forEach(function(pokemon) {
      grid.appendChild(renderPokemonCard(pokemon, openDetails));
    });
  }
}



function renderFavoritesGrid() {
  var grid = $id("favorites-grid");
  grid.innerHTML = "";

  var text = $id("favorites-count-text");
  text.textContent = favorites.length === 0
    ? "You have no favorites yet. Go to Explore to add some!"
    : "You have " + favorites.length + " Pokémon in your favorites";

  if (favorites.length === 0) {
    return;
  }

  favorites.forEach(function(pokemon) {
    grid.appendChild(renderPokemonCard(pokemon, openDetails));
  });
}



function setupControls() {
  var themeBtn = $id("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  var searchInput = $id("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function(e) {
      searchTerm = e.target.value;
      renderFiltered();
    });
  }

  var sortSelect = $id("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function(e) {
      currentSort = e.target.value;
      renderFiltered();
    });
  }

  var resetBtn = $id("reset-filters");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }

  document.querySelectorAll(".nav-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var tabName = this.getAttribute("data-tab");
      switchTab(tabName);
    });
  });

  var detailsModal = $id("details-modal");
  if (detailsModal) {
    detailsModal.addEventListener("click", function(e) {
      if (e.target === this) {
        hideDetailsModal();
      }
    });
  }

  var closeBtn = $id("close-details");
  if (closeBtn) closeBtn.addEventListener("click", hideDetailsModal);

  var detailsFavoriteBtn = $id("details-favorite-btn");
  if (detailsFavoriteBtn) {
    detailsFavoriteBtn.addEventListener("click", function() {
      if (currentSelectedPokemon) {
        toggleFavorite(currentSelectedPokemon);
        var btn = $id("details-favorite-btn");
        if (btn) {
          if (isFavorited(currentSelectedPokemon.id)) {
            btn.classList.add("favorited");
            btn.textContent = "♥";
          } else {
            btn.classList.remove("favorited");
            btn.textContent = "♡";
          }
        }

        var cards = document.querySelectorAll(".card-favorite");
        cards.forEach(function(card) {
          var cardName = card.closest(".card").querySelector(".pokemon-name");
          if (cardName && cardName.textContent.toLowerCase() === capitalize(currentSelectedPokemon.name).toLowerCase()) {
            card.classList.toggle("favorited");
            card.textContent = isFavorited(currentSelectedPokemon.id) ? "♥" : "♡";
          }
        });
      }
    });
  }

}



async function loadPokemon() {
  var grid = $id("pokemon-grid");
  var loading = $id("loading");
  var error = $id("error");

  loading.removeAttribute("hidden");
  error.setAttribute("hidden", "");
  grid.innerHTML = "";

  try {
    var list = await window.api.fetchPokemonList(LIMIT);

    var ids = list
      .map(function(item) {
        return window.api.getIdFromPokemonUrl(item.url);
      })
      .filter(function(id) {
        return !isNaN(id);
      })
      .slice(0, LIMIT);

    var detailsById = {};
    var index = 0;

    async function worker() {
      while (index < ids.length) {
        var myIndex = index;
        index++;

        var id = ids[myIndex];
        var details = await window.api.fetchPokemonDetailsById(id);
        detailsById[id] = details;
      }
    }

    var workers = [];
    var count = CONCURRENCY;
    if (count > ids.length) {
      count = ids.length;
    }

    for (var j = 0; j < count; j++) {
      workers.push(worker());
    }

    await Promise.all(workers);

    allPokemon = ids
      .sort(function(a, b) {
        return a - b;
      })
      .map(function(id) {
        return detailsById[id];
      })
      .filter(function(p) {
        return p;
      });

    loadFavorites();
    setupControls();
    initializeTypeFilters();
    renderFiltered();
    displayFeaturedPokemon();
    renderFeaturedPokemon();
    updateStats();

    loading.setAttribute("hidden", "");
    console.log("✓ Pokédex loaded successfully! Total: " + allPokemon.length);
  } catch (e) {
    console.error("✗ Error loading Pokédex:", e);
    loading.setAttribute("hidden", "");
    error.removeAttribute("hidden");

    var msg = "Failed to load Pokédex";
    if (e && e.message) {
      msg += " (" + e.message + ")";
    }
    if (e && e.status) {
      msg += " - Status: " + e.status;
    }

    error.textContent = msg;
    grid.innerHTML = "";
    console.error("Error details:", e);
  }
}



function filterByCategory(category) {

  var starterIds = [1, 4, 7]; // Bulbasaur, Charmander, Squirtle
  var legendaryIds = [144, 145, 146, 149, 150, 151]; // Articuno, Zapdos, Moltres, Dragonite, Mewtwo, Mew
  var categoryMap = {
    "starters": { type: null, ids: starterIds },
    "legendary": { type: null, ids: legendaryIds },
    "fire": { type: "fire", ids: null },
    "water": { type: "water", ids: null },
    "grass": { type: "grass", ids: null },
    "electric": { type: "electric", ids: null }
  };

  var config = categoryMap[category.toLowerCase()];
  if (!config) return;

  if (config.type) {
    setTypeFilter(config.type);
  } else if (config.ids) {

    currentFilter = "all"; // Reset type filter
    var filtered = allPokemon.filter(function(p) {
      return config.ids.indexOf(p.id) !== -1;
    });

    var grid = $id("pokemon-grid");
    grid.innerHTML = "";
    filtered.forEach(function(pokemon) {
      grid.appendChild(renderPokemonCard(pokemon));
    });
  }

  switchTab("explore");
}



function renderFeaturedPokemon() {
  if (allPokemon.length === 0) return;

  var grid = $id("featured-pokemon-grid");
  if (!grid) return;

  grid.innerHTML = "";

  var count = Math.min(5, allPokemon.length);
  var indices = [];
  while (indices.length < count) {
    var idx = Math.floor(Math.random() * allPokemon.length);
    if (indices.indexOf(idx) === -1) {
      indices.push(idx);
    }
  }

  indices.forEach(function(idx) {
    var pokemon = allPokemon[idx];
    grid.appendChild(renderPokemonCard(pokemon));
  });
}

function displayFeaturedPokemon() {
  if (allPokemon.length === 0) return;

  var randomIdx = Math.floor(Math.random() * Math.min(30, allPokemon.length));
  var featured = allPokemon[randomIdx];

  var img = $id("featured-pokemon-img");
  var name = $id("featured-pokemon-name");

  if (img) {
    img.src = featured.sprites.front_default || "";
    img.alt = featured.name;
  }

  if (name) {
    name.textContent = capitalize(featured.name);
  }
}



function updateStats() {

  var favCount = $id("stat-favorites");
  if (favCount) {
    favCount.textContent = favorites.length;
  }

  var pokemonCount = $id("stat-pokemon");
  if (pokemonCount) {
    pokemonCount.textContent = allPokemon.length + "+";
  }

  var typeCount = $id("stat-types");
  if (typeCount) {
    var types = new Set();
    allPokemon.forEach(function(p) {
      p.types.forEach(function(t) {
        types.add(t.type.name);
      });
    });
    typeCount.textContent = types.size;
  }
}



document.addEventListener("DOMContentLoaded", function() {
  console.log("✓ DOM Content Loaded - Initializing Pokédex Explorer");

  initializeTheme();
  console.log("✓ Theme initialized");

  switchTab("home");
  console.log("✓ Home tab activated");

  console.log("✓ Starting to load Pokémon data...");
  loadPokemon();
});
