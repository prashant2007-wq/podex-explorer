const POKEAPI_BASE = "https://pokeapi.co/api/v2";
function getIdFromPokemonUrl(url) {
  // Example: https://pokeapi.co/api/v2/pokemon/25/
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) 
    {
    throw new Error(`Request failed (${res.status}) for ${url}`);
  }
  return res.json();
}
async function fetchPokemonList(limit=151) 
{
  const url = `${POKEAPI_BASE}/pokemon?limit=${limit}`;
  const data=await fetchJson(url);
  return data.results ||[];
}
async function fetchPokemonDetailsById(id) {
  return fetchJson(`${POKEAPI_BASE}/pokemon/${id}`);
}

async function fetchPokemonSpeciesById(id) {
  return fetchJson(`${POKEAPI_BASE}/pokemon-species/${id}`);
}

function extractEnglishFlavorText(speciesData) 
{
  var entries = [];
  if (speciesData && speciesData.flavor_text_entries) {
    entries = speciesData.flavor_text_entries;
  }

  var text = "";
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e && e.language && e.language.name === "en" && e.flavor_text) {
      text = e.flavor_text;
      break;
    }
  }

  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

window.api = {
  fetchPokemonList,
  fetchPokemonDetailsById,
  fetchPokemonSpeciesById,
  getIdFromPokemonUrl,
  extractEnglishFlavorText,
};

