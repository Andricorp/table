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
let modalIsOpen = false;
let modal = document.createElement('section')
let img = document.createElement('div');

thValue
  .set("name")
  .set("language")
  .set("genres")
  .set("status")
  .set("rating");
toSort.set("name").set("rating");
autocompleteBlock.style.background = "gray";
autocompleteBlock.style.opacity = 0.8;
document.body.appendChild(modal)


init();

function init() {
  parseGet("girls");
//   send.addEventListener("click", function() {
    // parseGet();
//   });
  search.addEventListener("keydown", function(event) {
    //   if()
    if(event.keyCode == 13){
        // $("#id_of_button").click();
        parseGet();

        // $(this).val('');
    }
    // parseGet();
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

window.onclick = () => {autocompleteBlock.innerHTML = "", modal.innerHTML = null};

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
      parseGet(p.innerHTML);
      search.style.background = null
    });
    p.addEventListener("mouseover", function() {
        search.value = p.innerHTML
        search.style.background = 'yellow'
        p.style.background = 'black'
    });
    p.addEventListener("mouseout", function() {
        search.style.background = null
        p.style.background = null
        search.value = null
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
//   search.value = "";

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

    for (let key in el.show) {
      let val = el.show[key];

      if (thValue.has(key)) {
        if (!index) {
          createCell(headTrs, key, val, get, "th");
        }
        if (key == "rating") {
          createCell(tr, key, val.average, get, 'td');
        } else {
          createCell(tr, key, val, get, 'td');
        }
      }
    }

    table.appendChild(tr);
  });
  text.appendChild(table);
}

function createCell(par, key, val = " - ", data, child = "td") {
  let td = document.createElement(child);
  if (child==='th') {
    // td.innerHTML = val.toUpperCase()
    let head = document.createElement("div");
    head.innerHTML = key.toUpperCase();
    td.appendChild(head);

    if (toSort.has(key)) {
      if (key === "name") {
        if (sortNameUp) {
          // sortVectName.innerHTML='Z'
          addEvent(() => {
            sortVectName.innerHTML = " A-Z";
            console.log('name T',key)
            sortData(key, data, true);

          });
          sortNameUp = false;
        } else {
          addEvent(() => {
            sortVectName.innerHTML = " Z-A";
            console.log('name F',key)
            sortData(key, data, false);

          });
          sortNameUp = true;
        }

        // td.appendChild(sortVectName)
        head.appendChild(sortVectName);
      }
      if (key === "rating") {
        if (sortRating) {
          addEvent(() => {
            sortVectRating.innerHTML = "&#9660";;
            console.log('ratuing T',key)
            sortData(key, data, true);
          });
          sortRating = false;
        } else {
          addEvent(() => {
            sortVectRating.innerHTML = "&#9650;";
            console.log('ratuing F',key)
            sortData(key, data, false);
          });
          sortRating = true;
        }
        // td.appendChild(sortVectRating)
        head.appendChild(sortVectRating);
      }
    }
  } else {
      if (key === "name"){
        addEvent(()=> {
          openModal(modalIsOpen, key, val, data)
        })
        if(modalIsOpen){
          modalIsOpen==false
        }
        else{
          modalIsOpen==true
        }
      }
      if(val === null){
        td.innerHTML = "&#8722;"
        // console.log(val)
      } 
      else {
          td.innerHTML = val;
      }
  }
  par.appendChild(td);
  // par.addEventListener("click", function() {
  //   let modal = document.createElement("div");
  //   let off = document.createElement("div");
  //   document.body.appendChild(modal);
  //   document.body.appendChild(off);
  // });

  function addEvent(func, element = td) {
    element.addEventListener("click", function() {
      func();
    });
  }
}

function sortData(key, data, sortHigh = false) {
    data.sort(compareNumeric);
    function compareNumeric(a, b) {
      if (key === "name") {
        console.log('Sort name T',key)
        if (a.show.name > b.show.name) return 1;
        if (a.show.name < b.show.name) return -1;
      } else {
        console.log('Sort rating T',key)
        if (a.show.rating.average > b.show.rating.average) return 1;
        if (a.show.rating.average < b.show.rating.average) return -1;
      }
    }
  if (!sortHigh) {
    data.sort(compareNumeric);
    console.log('Sort false',key)
    data.reverse();
  }
  parseGet(null, data);
}

async function openModal(modalIsOpen, keys, val, data){
  modal.innerHTML = null
  let modalInf = await jsonFetch("http://api.tvmaze.com/singlesearch/shows?q="+val)
  // if( ){}
  for(key in modalInf){
    modal.innerHTML+= key+" "+ modalInf[key];
    if(key === "image"){
      console.log(modalInf[key].medium)
      img.style.backgroundImage = 'url('+modalInf[key].medium+') '
      img.style.backgroundRepeat= 'no-repeat'
      img.style.height = '200px'
      img.style.width = '300px'
modal.appendChild(img)

    }
  }
  // document.body.appendChild(modal)
}

