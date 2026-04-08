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

function scrollToAllPokemon() {
  var anchor = $id("all-pokemon-anchor");
  if (!anchor) return;
  anchor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  updateThemeToggleText();
}

function updateThemeToggleText() {
  var btn = $id("theme-toggle");
  if (!btn) return;
  btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

function initializeTheme() {
  var savedTheme = localStorage.getItem("theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);

  if (shouldUseDark) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
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
  var sorted = pokemonList.slice();

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
