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


function jsonGet(url, method)
    {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();   
            xhr.onerror = () => reject(new Error('jsonGet failed'))
            xhr.open(method, url, true);
            xhr.send()

            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && (xhr.status == 200 )){
                    resolve(JSON.parse(xhr.responseText))
                }
                else if (xhr.status != 200 ){
                    reject(new Error('status is not 200'))
                }
            }
        })

    }


function autocomplete(searchV = search.value){

    jsonGet("http://api.tvmaze.com/search/shows?q="+searchV, 'GET')
    .then(get=>{
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
    })
}

function parseGet (searchV = search.value){
    text.innerHTML = ''
    autocompleteBlock.innerHTML = ''
    search.value = ""

        jsonGet("http://api.tvmaze.com/search/shows?q="+searchV, 'GET')
        .then(get=>{


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

        })
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

