let send = document.getElementById('get')
let search = document.getElementById('search')
let showBlock = document.getElementById('showBlock')
let text = document.getElementById('text')
let autocompleteBlock = document.createElement('div')
let prev = '';
const thValue = new Map()

thValue.set('name').set('language').set('genres').set('status').set('rating')
autocompleteBlock.style.background='gray';
autocompleteBlock.style.opacity=0.8;


parseGet('girls')

send.addEventListener('click', function(){
    parseGet()
});

search.addEventListener('input', function(){
    autocomplete()
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

async function parseGet (searchV = search.value){
    text.innerHTML = ''
    autocompleteBlock.innerHTML = ''
    search.value = ""

    let get = await jsonFetch("http://api.tvmaze.com/search/shows?q="+searchV)

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
                        createCell(headTrs, key, true, 'th')
                        }
                        createCell(tr, val)
                    }
                }

                table.appendChild(tr);
            });
            text.appendChild(table);
}

function createCell(par, val, up=false, child = 'td'){
    let td = document.createElement(child);
    if(up){
        td.innerHTML = val.toUpperCase()
    }
    else{
        td.innerHTML =  val;
    }
    par.appendChild(td);
}

