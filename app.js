var LIMIT=151;
var CONCURRENCY=12;

function $id(id){
  return document.getElementById(id);
}

function capitalize(s){
  if(!s){
    return "";
  }
  return s[0].toUpperCase()+s.slice(1);
}

function typeBadges(types){
  var s="";
  for(var i=0;i<types.length;i++){
    if(i>0){
      s+=", ";
    }
    s+=capitalize(types[i]);
  }
  return s;
}

function formatPokeId(id){
  var s=String(id);
  while(s.length<3){
    s="0"+s;
  }
  return s;
}

function renderPokemonCard(pokemon,onClick){
  var id=pokemon.id;
  var name=pokemon.name;
  var types=[];

  if(pokemon.types){
    for(var i=0;i<pokemon.types.length&&types.length<2;i++){
      if(pokemon.types[i].type&&pokemon.types[i].type.name){
        types.push(pokemon.types[i].type.name);
      }
    }
  }

  var card=document.createElement("article");
  card.className="card";
  card.setAttribute("aria-label","Open details for "+name);
  card.setAttribute("role","button");
  card.setAttribute("tabindex","0");

  card.addEventListener("click",function(){
    onClick(pokemon);
  });

  var idEl=document.createElement("div");
  idEl.className="pokemon-id";
  idEl.textContent="#"+formatPokeId(id);

  var nameEl=document.createElement("h3");
  nameEl.className="pokemon-name";
  nameEl.textContent=capitalize(name);

  var imgWrap=document.createElement("div");
  var img=document.createElement("img");
  img.alt=name;

  var pic="";
  if(pokemon.sprites){
    if(pokemon.sprites.other&&pokemon.sprites.other["official-artwork"]&&pokemon.sprites.other["official-artwork"].front_default){
      pic=pokemon.sprites.other["official-artwork"].front_default;
    }else if(pokemon.sprites.front_default){
      pic=pokemon.sprites.front_default;
    }
  }

  img.src=pic;
  imgWrap.appendChild(img);

  var typesEl=document.createElement("p");
  typesEl.className="pokemon-types";
  typesEl.textContent="Types: "+typeBadges(types);

  card.appendChild(idEl);
  card.appendChild(nameEl);
  card.appendChild(imgWrap);
  card.appendChild(typesEl);

  return card;
}

async function populateDescriptionForId(id){
  try{
    var species=await window.api.fetchPokemonSpeciesById(id);
    var text=window.api.extractEnglishFlavorText(species);

    if(text){
      $id("details-description").textContent=text;
    }else{
      $id("details-description").textContent="No description available.";
    }
  }catch(e){
    $id("details-description").textContent="Failed to load description.";
  }
}

function showBaseStats(details){
  var wanted=["hp","attack","defense","speed"];
  var stats=details.stats||[];
  var body=$id("details-stats-body");
  body.innerHTML="";

  for(var i=0;i<wanted.length;i++){
    var key=wanted[i];
    var value="-";

    for(var j=0;j<stats.length;j++){
      if(stats[j].stat&&stats[j].stat.name===key){
        value=stats[j].base_stat;
        break;
      }
    }

    var tr=document.createElement("tr");
    var td1=document.createElement("td");
    td1.textContent=key.toUpperCase();

    var td2=document.createElement("td");
    td2.textContent=value;

    tr.appendChild(td1);
    tr.appendChild(td2);
    body.appendChild(tr);
  }
}

async function openDetails(pokemon){
  var id=pokemon.id;
  var name=pokemon.name;
  var types=[];
  var abilities=[];

  if(pokemon.types){
    for(var i=0;i<pokemon.types.length;i++){
      if(pokemon.types[i].type&&pokemon.types[i].type.name){
        types.push(pokemon.types[i].type.name);
      }
    }
  }

  if(pokemon.abilities){
    for(var j=0;j<pokemon.abilities.length;j++){
      if(pokemon.abilities[j].ability&&pokemon.abilities[j].ability.name){
        abilities.push(pokemon.abilities[j].ability.name);
      }
    }
  }

  $id("details-name").textContent=capitalize(name);
  $id("details-id").textContent="#"+formatPokeId(id);

  var pic="";
  if(pokemon.sprites){
    if(pokemon.sprites.other&&pokemon.sprites.other["official-artwork"]&&pokemon.sprites.other["official-artwork"].front_default){
      pic=pokemon.sprites.other["official-artwork"].front_default;
    }else if(pokemon.sprites.front_default){
      pic=pokemon.sprites.front_default;
    }
  }

  $id("details-img").src=pic;
  $id("details-img").alt=name;

  if(types.length>0){
    $id("details-types").textContent=typeBadges(types);
  }else{
    $id("details-types").textContent="-";
  }

  if(abilities.length>0){
    var s="";
    for(var k=0;k<abilities.length;k++){
      if(k>0){
        s+=", ";
      }
      s+=capitalize(abilities[k]);
    }
    $id("details-abilities").textContent=s;
  }else{
    $id("details-abilities").textContent="-";
  }

  showBaseStats(pokemon);

  $id("details-description").textContent="Loading description...";
  $id("details-body").removeAttribute("hidden");
  $id("details-empty").setAttribute("hidden","");

  await populateDescriptionForId(id);
}

async function loadPokemon(){
  var grid=$id("pokemon-grid");
  var loading=$id("loading");
  var error=$id("error");

  loading.removeAttribute("hidden");
  error.setAttribute("hidden","");
  grid.innerHTML="";

  try{
    var list=await window.api.fetchPokemonList(LIMIT);
    var ids=[];

    for(var i=0;i<list.length;i++){
      var id=window.api.getIdFromPokemonUrl(list[i].url);
      if(!isNaN(id)){
        ids.push(id);
      }
    }

    if(ids.length>LIMIT){
      ids=ids.slice(0,LIMIT);
    }

    var detailsById={};
    var index=0;

    async function worker(){
      while(index<ids.length){
        var myIndex=index;
        index++;

        var id=ids[myIndex];
        var details=await window.api.fetchPokemonDetailsById(id);
        detailsById[id]=details;
      }
    }

    var workers=[];
    var count=CONCURRENCY;
    if(count>ids.length){
      count=ids.length;
    }

    for(var j=0;j<count;j++){
      workers.push(worker());
    }

    await Promise.all(workers);

    ids.sort(function(a,b){
      return a-b;
    });

    for(var k=0;k<ids.length;k++){
      var details=detailsById[ids[k]];
      if(details){
        grid.appendChild(renderPokemonCard(details,openDetails));
      }
    }

    loading.setAttribute("hidden","");
  }catch(e){
    loading.setAttribute("hidden","");
    error.removeAttribute("hidden");

    var msg="";
    if(e&&e.message){
      msg=" ("+e.message+")";
    }

    error.textContent="Failed to load Pokédex."+msg;
    grid.innerHTML="";
  }
}

document.addEventListener("DOMContentLoaded",function(){
  loadPokemon();
});