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


    // search.addEventListener('change', function(){
    //     let searchV = search.value
    //     console.log('vjv',searchV);
    // })
    let i =0
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
                //прописать заголовок таблицы

                let tr = document.createElement('tr');
            // let headTrs = document.createElement('tr');
                
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
        // let searchV = search.value

        // jsonPost("http://api.tvmaze.com/search/shows?q="+searchV, 'GET')
        // .then(get=>{
        //     if(!get.length){
        //         console.log('NO DATA');
        //         let err = document.createElement('h1');
        //         err.innerHTML = "По данному запросу нет данных"
        //         text.appendChild(err)
        //     }
        //     let table = document.createElement('table');

        //     get.forEach((el, index) => {
        //         console.log('el ',el);
        //         console.log('show',el.show);
        //         //прописать заголовок таблицы

        //         let tr = document.createElement('tr');
        //     // let headTrs = document.createElement('tr');
                
        //     if(index == 0) {
        //         var headTrs = document.createElement('tr');
        //         table.appendChild(headTrs)
        //     }
    
        //         for(key in el.show){
        //             let val = el.show[key];

        //             if(key == 'name' || key == 'language' || key == 'genres' || key == 'status' || key == 'rating'){
        //                 if(index == 0){
        //                     console.log('first th',el.show);
        //                     let th = document.createElement('th');
        //                     th.innerHTML =  key.toUpperCase();
        //                     headTrs.appendChild(th);
        //                 }
        //                 let td = document.createElement('td');
        //                 console.log('elem',key); 
        //                 td.innerHTML =  val;
        //                 tr.appendChild(td);
                        
                        
                    
        //             }

                    
                
        //         }

        //         table.appendChild(tr);
        //     });
        //     text.appendChild(table);

        // })
    });

// function mass(get){
    // console.log(get);
// }











// var request = new XMLHttpRequest()
// request.open('GET', 'http://api.tvmaze.com/search/shows?q=girls', true)
// request.onreadystatechange = function(){ //обработчик изменения статуса запроса. Статус == 4 сигнализирует о том, что запрос окончен.
// if (request.readyState != 4){
// return;
// }
// if (request.status == 200){
// var obj = JSON.parse(request.responseText);
// console.log(request.responseText);}
// else {
// alert('shit happens: ' +  request.status + ', ' + request.statusText );
// }

// console.log(obj);

// }





// get.onclick = async ()=>{
        // request.send()

//     let resp = await fetch('http://api.tvmaze.com/search/shows?q=girls', {// ждем прихода данных от сервера
//             method: 'get',  
//             headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             }})

//             let data = await resp.json() // записываем эти данные
//             console.log(data);

//             // data.forEach((element, index) => { // т.к.  там массив - проходим по нему
//             //     root.innerHTML += 'index '+index+' id = '+element.id+', ' //
//             // });


        // }