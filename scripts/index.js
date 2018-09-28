let send = document.getElementById("get");
let search = document.getElementById("search");
let showBlock = document.getElementById("showBlock");
let text = document.getElementById("text");
let autocompleteBlock = document.createElement("div");
let sortVectName = document.createElement("div");
let sortVectRating = document.createElement("div");
let prev = "";
const thValue = new Map();
const toSort = new Map();
let sortNameUp = true;
let sortRating = true;

thValue
  .set("name")
  .set("language")
  .set("genres")
  .set("status")
  .set("rating");
toSort.set("name").set("rating");
autocompleteBlock.style.background = "gray";
autocompleteBlock.style.opacity = 0.8;

init();

function init() {
  parseGet("girls");
  send.addEventListener("click", function() {
    parseGet();
  });

  search.addEventListener("input", function() {
    if (debounce) {
      clearTimeout(debounce);
      debounce = null;
    }
    var debounce = setTimeout(() => {
      autocomplete();
    }, 1200);
  });
}

window.onclick = () => (autocompleteBlock.innerHTML = "");

async function jsonFetch(url) {
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

async function autocomplete(searchV = search.value) {
  let get = await jsonFetch("http://api.tvmaze.com/search/shows?q=" + searchV);
  prev.innerHTML = "";
  get.forEach((el, index) => {
    let p = document.createElement("p");

    p.style.cursor = "pointer";
    p.style.color = "white";

    p.addEventListener("click", function() {
      // search.value = p.innerHTML
      // autocompleteBlock.innerHTML='';
      parseGet();
    });

    p.innerHTML = el.show.name;
    autocompleteBlock.appendChild(p);
    if (index > 5) return;
  });
  showBlock.appendChild(autocompleteBlock);

  prev = autocompleteBlock;
}

async function parseGet(searchV = search.value, get) {
  text.innerHTML = "";
  autocompleteBlock.innerHTML = "";
  search.value = "";

  if (!get)
    get = await jsonFetch("http://api.tvmaze.com/search/shows?q=" + searchV);

  if (!get.length) {
    console.log("NO DATA");
    let err = document.createElement("h1");
    err.innerHTML = "По данному запросу нет данных";
    text.appendChild(err);
  }

  let table = document.createElement("table");

  get.forEach((el, index) => {
    let tr = document.createElement("tr");
    if (!index) {
      var headTrs = document.createElement("tr");
      table.appendChild(headTrs);
    }

    for (key in el.show) {
      let val = el.show[key];

      if (thValue.has(key)) {
        if (!index) {
          createCell(headTrs, key, get, "th");
        }
        if (key == "rating") {
          createCell(tr, val.average);
        } else {
          createCell(tr, val);
        }
      }
    }

    table.appendChild(tr);
  });
  text.appendChild(table);
}

function createCell(par, val = "-", data = false, child = "td") {
  let td = document.createElement(child);
  if (data) {
    // td.innerHTML = val.toUpperCase()
    let head = document.createElement("div");
    head.innerHTML = val.toUpperCase();
    td.appendChild(head);

    if (toSort.has(val)) {
      if (val === "name") {
        if (sortNameUp) {
          // sortVectName.innerHTML='Z'
          addEvent(() => {
            sortVectName.innerHTML = " A-Z";
            sortData(val, data, true);
          });
          sortNameUp = false;
        } else {
          addEvent(() => {
            sortVectName.innerHTML = " Z-A";
            sortData(val, data);
          });
          sortNameUp = true;
        }

        // td.appendChild(sortVectName)
        head.appendChild(sortVectName);
      }
      if (val === "rating") {
        if (sortRating) {
          addEvent(() => {
            sortVectRating.innerHTML = " V";
            sortData(val, data, true);
          });
          sortRating = false;
        } else {
          addEvent(() => {
            sortVectRating.innerHTML = " ^";
            sortData(val, data);
          });
          sortRating = true;
        }
        // td.appendChild(sortVectRating)
        head.appendChild(sortVectRating);
      }
    }
  } else {
    td.innerHTML = val; //func to new request
  }
  par.appendChild(td);
  par.addEventListener("click", function() {
    let modal = document.createElement("div");
    let off = document.createElement("div");
    document.body.appendChild(modal);
    document.body.appendChild(off);
  });

  function addEvent(func, element = td) {
    element.addEventListener("click", function() {
      func();
    });
  }
}

function sortData(val, data, sortHigh = false) {
  if (sortHigh) {
    data.sort(compareNumeric);
    function compareNumeric(a, b) {
      if (val == "name") {
        if (a.show.name > b.show.name) return 1;
        if (a.show.name < b.show.name) return -1;
      } else {
        if (a.show.rating.average > b.show.rating.average) return 1;
        if (a.show.rating.average < b.show.rating.average) return -1;
      }
    }
  } else {
    data.reverse();
  }
  parseGet(null, data);
}
