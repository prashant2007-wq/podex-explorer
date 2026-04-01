const POKEAPI_BASE = "https://pokeapi.co/api/v2";

function getIdFromPokemonUrl(url) {
  const parts = url.split("/");
  return Number(parts[parts.length - 2]);
}

async function fetchJson(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Request failed");
    }

    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
}

async function fetchPokemonList(limit = 151) {
  try {
    const url = POKEAPI_BASE + "/pokemon?limit=" + limit;
    const data = await fetchJson(url);

    if (data.results) {
      return data.results;
    }

    return [];
  } catch (e) {
    throw e;
  }
}

async function fetchPokemonDetailsById(id) {
  try {
    const url = POKEAPI_BASE + "/pokemon/" + id;
    const data = await fetchJson(url);
    return data;
  } catch (e) {
    throw e;
  }
}

async function fetchPokemonSpeciesById(id) {
  try {
    const url = POKEAPI_BASE + "/pokemon-species/" + id;
    const data = await fetchJson(url);
    return data;
  } catch (e) {
    throw e;
  }
}

function extractEnglishFlavorText(speciesData) {
  let entries = [];
  let text = "";

  if (speciesData && speciesData.flavor_text_entries) {
    entries = speciesData.flavor_text_entries;
  }

  for (let i = 0; i < entries.length; i++) {
    if (
      entries[i] &&
      entries[i].language &&
      entries[i].language.name === "en" &&
      entries[i].flavor_text
    ) {
      text = entries[i].flavor_text;
      break;
    }
  }

  if (text === "") {
    return "";
  }

  text = text.replace(/\s+/g, " ");
  text = text.trim();

  return text;
}

window.api = {
  fetchPokemonList,
  fetchPokemonDetailsById,
  fetchPokemonSpeciesById,
  getIdFromPokemonUrl,
  extractEnglishFlavorText,
};