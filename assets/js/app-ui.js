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
    if (typeof onClick === "function") {
      onClick(pokemon);
    } else {
      showDetailsModal(pokemon);
    }
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

  var stats = pokemon.stats || [];
  var hpStat = stats.find(function(s) {
    return s.stat && s.stat.name === "hp";
  });
  var atkStat = stats.find(function(s) {
    return s.stat && s.stat.name === "attack";
  });

  var abilities = [];
  if (pokemon.abilities) {
    pokemon.abilities.slice(0, 2).forEach(function(abilityObj) {
      if (abilityObj.ability && abilityObj.ability.name) {
        abilities.push(capitalize(abilityObj.ability.name));
      }
    });
  }

  var hoverDetails = document.createElement("div");
  hoverDetails.className = "card-hover-details";
  hoverDetails.innerHTML =
    "<p><strong>HP:</strong> " + (hpStat ? hpStat.base_stat : "-") + "</p>" +
    "<p><strong>ATK:</strong> " + (atkStat ? atkStat.base_stat : "-") + "</p>" +
    "<p><strong>Abilities:</strong> " + (abilities.length ? abilities.join(", ") : "-") + "</p>";

  card.appendChild(idEl);
  card.appendChild(nameEl);
  card.appendChild(imgWrap);
  card.appendChild(typesEl);
  card.appendChild(hoverDetails);

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
    renderLegendarySpotlight();
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
  var starterIds = [1, 4, 7];
  var legendaryIds = [144, 145, 146, 149, 150, 151];
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
    currentFilter = "all";
    var filtered = allPokemon.filter(function(p) {
      return config.ids.indexOf(p.id) !== -1;
    });

    var grid = $id("pokemon-grid");
    grid.innerHTML = "";
    filtered.forEach(function(pokemon) {
      grid.appendChild(renderPokemonCard(pokemon, openDetails));
    });
  }

  switchTab("explore");
}

function renderFeaturedPokemon() {
  if (allPokemon.length === 0) return;

  var count = Math.min(5, allPokemon.length);
  var indices = [];
  while (indices.length < count) {
    var idx = Math.floor(Math.random() * allPokemon.length);
    if (indices.indexOf(idx) === -1) {
      indices.push(idx);
    }
  }

  var targetGrids = ["featured-pokemon-grid", "explore-trending-grid"];
  targetGrids.forEach(function(gridId) {
    var grid = $id(gridId);
    if (!grid) return;
    grid.innerHTML = "";

    indices.forEach(function(idx) {
      var pokemon = allPokemon[idx];
      grid.appendChild(renderPokemonCard(pokemon, openDetails));
    });
  });
}

function renderLegendarySpotlight() {
  var grid = $id("legendary-spotlight-grid");
  if (!grid) return;
  grid.innerHTML = "";

  var legendaryShowcaseIds = [144, 145, 146, 149];
  var spotlightPokemon = allPokemon.filter(function(pokemon) {
    return legendaryShowcaseIds.indexOf(pokemon.id) !== -1;
  });

  spotlightPokemon.forEach(function(pokemon) {
    grid.appendChild(renderPokemonCard(pokemon, openDetails));
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
  var exploreFavCount = $id("explore-stat-favorites");
  if (exploreFavCount) {
    exploreFavCount.textContent = favorites.length;
  }

  var pokemonCount = $id("stat-pokemon");
  if (pokemonCount) {
    pokemonCount.textContent = allPokemon.length + "+";
  }
  var explorePokemonCount = $id("explore-stat-pokemon");
  if (explorePokemonCount) {
    explorePokemonCount.textContent = allPokemon.length + "+";
  }

  var types = new Set();
  allPokemon.forEach(function(p) {
    p.types.forEach(function(t) {
      types.add(t.type.name);
    });
  });

  var typeCount = $id("stat-types");
  if (typeCount) {
    typeCount.textContent = types.size;
  }
  var exploreTypeCount = $id("explore-stat-types");
  if (exploreTypeCount) {
    exploreTypeCount.textContent = types.size;
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
