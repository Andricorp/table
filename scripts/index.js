let send = document.getElementById('get')
let search = document.getElementById('search')
let variants = document.getElementById('variants')
let text = document.getElementById('text')
// let variant = document.createElement('div')







function jsonPost(url, method)
    {
        return new Promise((resolve, reject) => {
            var x = new XMLHttpRequest();   
            x.onerror = () => reject(new Error('jsonPost failed'))
            //x.setRequestHeader('Content-Type', 'application/json');
            x.open(method, url, true);
            // x.send(JSON.stringify(data))
            x.send()

            x.onreadystatechange = () => {
                if (x.readyState == XMLHttpRequest.DONE && x.status == 200){
                    resolve(JSON.parse(x.responseText))
                }
                else if (x.status != 200){
                    reject(new Error('status is not 200'))
                }
            }
        })

    }


    let prev = '';
    search.oninput = function() {
        let searchV = search.value
        console.log('vjv',searchV);
        jsonPost("http://api.tvmaze.com/search/shows?q="+searchV, 'GET')
        .then(get=>{
            // if(i>0){
                console.log(prev); prev.innerHTML = ""
            // }
            variant = document.createElement('div')
            get.forEach((el, index) => {
                console.log(el.show.name); 
                let p = document.createElement('p')
                p.innerHTML = el.show.name;
                variant.appendChild(p)
                if(index>5)return
            })
            variants.appendChild(variant)

            prev = variant

        
        })
      }




function Get (searchV = search.value){
    

        jsonPost("http://api.tvmaze.com/search/shows?q="+searchV, 'GET')
        .then(get=>{
            if(!get.length){
                console.log('NO DATA');
                let err = document.createElement('h1');
                err.innerHTML = "По данному запросу нет данных"
                text.appendChild(err)
            }
            let table = document.createElement('table');

            get.forEach((el, index) => {
                console.log('el ',el);
                console.log('show',el.show);

                let tr = document.createElement('tr');
            if(index == 0) {
                var headTrs = document.createElement('tr');
                table.appendChild(headTrs)
            }
    
                for(key in el.show){
                    let val = el.show[key];

                    if(key == 'name' || key == 'language' || key == 'genres' || key == 'status' || key == 'rating'){
                        if(index == 0){
                            console.log('first th',el.show);
                            let th = document.createElement('th');
                            th.innerHTML =  key.toUpperCase();
                            headTrs.appendChild(th);
                        }
                        let td = document.createElement('td');
                        console.log('elem',key); 
                        td.innerHTML =  val;
                        tr.appendChild(td);
                        
                        
                    
                    }

                    
                
                }

                table.appendChild(tr);
            });
            text.appendChild(table);

        })
}


Get('girls')

send.addEventListener('click', function(){
    Get()
});