let send = document.getElementById('get')
let search = document.getElementById('search')
let showBlock = document.getElementById('showBlock')
let text = document.getElementById('text')
let autocompleteBlock = document.createElement('div')
let sortVect = document.createElement('div')
let prev = '';
const thValue = new Map();
const toSort = new Map();
let sortNameUp = true;
thValue.set('name').set('language').set('genres').set('status').set('rating');
toSort.set('name').set('rating');
autocompleteBlock.style.background='gray';
autocompleteBlock.style.opacity=0.8;


parseGet('girls')

send.addEventListener('click', function(){
    parseGet()
});

search.addEventListener('input', function(){
    if(debounce){
        clearTimeout(debounce);
    }
    var debounce = setTimeout( ()=>{
        autocomplete();
        debounce=''   
    }, 1700
    )
})

window.onclick=()=>autocompleteBlock.innerHTML = ""

async function jsonFetch(url){
    let res = await fetch(url)
    let data = await res.json();
    return data
}


async function autocomplete(searchV = search.value){
    let get = await jsonFetch("http://api.tvmaze.com/search/shows?q="+searchV)
        prev.innerHTML = ""
        get.forEach((el, index) => {
            let p = document.createElement('p')

            p.style.cursor = 'pointer'
            p.style.color='white'

            p.addEventListener('click', function(){
                search.value = p.innerHTML
                autocompleteBlock.innerHTML='';
                // parseGet()
            })
            
            p.innerHTML = el.show.name;
            autocompleteBlock.appendChild(p)
            if(index>5)return
        })
        showBlock.appendChild(autocompleteBlock)

        prev = autocompleteBlock
}

async function parseGet (searchV = search.value, get){
    text.innerHTML = ''
    autocompleteBlock.innerHTML = ''
    search.value = ""

    if(!get) get = await jsonFetch("http://api.tvmaze.com/search/shows?q="+searchV)

            if(!get.length){
                console.log('NO DATA');
                let err = document.createElement('h1');
                err.innerHTML = "По данному запросу нет данных"
                text.appendChild(err)
            }

            let table = document.createElement('table');

            get.forEach((el, index) => {

                let tr = document.createElement('tr');
                if(index == 0) {
                    var headTrs = document.createElement('tr');
                    table.appendChild(headTrs)
                }
    
                for(key in el.show){
                    let val = el.show[key];

                    if(thValue.has(key)){
                        if(index == 0){
                            createCell(headTrs, key, get, 'th', searchV)
                        }
                        if(key == 'rating'){
                            createCell(tr, val.average)
                        }
                        else createCell(tr, val)
                    }
                }

                table.appendChild(tr);
            });
            text.appendChild(table);
}

function createCell(par, val='-', data=false, child = 'td', searchV){
    let td = document.createElement(child);
    if(data){
        td.innerHTML = val.toUpperCase()
        if(toSort.has(val)){
            if(val=='name'){
                if(sortNameUp){
                    sortVect.innerHTML='Z'
                }
                else{
                    sortVect.innerHTML='A'
                }
                td.appendChild(sortVect)
            }             
            function SortData(){
                if(val=='name'){
                    if(sortNameUp){
                        data.sort(compareNumeric)
                        function compareNumeric(a, b) {
                            if (a.show.name > b.show.name) return 1;
                            if (a.show.name < b.show.name) return -1;
                        }
                        sortNameUp = false
                    }
                    else {
                        data.reverse()
                        sortNameUp = true
                    }
                    
                    parseGet(searchV, data)
                    console.log(data)
                }
                else if(val=='rating'){
                    data.sort(compareNumeric)
                    function compareNumeric(a, b) {
                        if (a.show.rating.average > b.show.rating.average) return 1;
                        if (a.show.rating.average < b.show.rating.average) return -1;
                    }
                    parseGet(searchV, data)

                }
                // arr.sort
            }
            addEvent(SortData)
        }
        
    }
    else{
        td.innerHTML =  val;//func to new request
    }
    par.appendChild(td);
    function addEvent(func){
        td.addEventListener('click', function(){
            console.log('clicked')
            func()
        })
    }
}

