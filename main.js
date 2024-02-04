import { setStorage,getStorage,icons,userIcon, } from './helpers.js';
const form = document.querySelector('form');
const noteList=document.querySelector("ul")
let coords;
let notes=getStorage() || [];
let markerLayer=null;
let map;
function loadMap(coords){
     map = L.map('map').setView(coords, 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    markerLayer=L.layerGroup().addTo(map);
    L.marker(coords,{icon:userIcon}).addTo(map)
     
 renderNoteList(notes);


    map.on("click",onMapClick)
}


    form[3].addEventListener("click",()=>{
        form.reset()
        form.style.display="none"
    })

    form.addEventListener("submit",(e)=>{
        e.preventDefault()
        const newNote={
            id:new Date().getTime(),
            title:form[0].value,
            date:form[1].value,
            status:form[2].value,
            coords:coords,
        }
      notes.unshift(newNote);
      renderNoteList(notes);
      setStorage(notes)
     form.style.display="none"
     form.reset()
    })
    function renderMarker(note) {
        // imleç oluştur
        L.marker(note.coords, { icons})
          // imleci katman ekle
          .addTo(markerLayer)
          .bindPopup(note.title)
         
      }

    function renderNoteList(items){
     noteList.innerHTML=""; 
    markerLayer.clearLayers();
   items.forEach((note)=>{
   const listEle= document.createElement("li");
   listEle.dataset.id=note.id
   listEle.innerHTML=`
                       <div class="info">
                        <p>${note.title}</p>
                        <p>
                            <span>Tarih:</span>
                            <span>${note.date}</span>
                        </p>
                        <p>
                            <span>Durum:</span>
                            <span>${note.status}</span>
                        </p>
                    </div>
                    <div class="icons">
                        <i id="fly" class="bi bi-airplane-fill"></i>
                        <i id="delete" class="bi bi-trash-fill"></i>
                    </div>
   `
   noteList.appendChild(listEle)
   renderMarker(note)
   })

    }

  

    
navigator.geolocation.getCurrentPosition(
    (e)=>{
        loadMap([e.coords.latitude,e.coords.longitude])
    },
    ()=>{
        loadMap([39.953925,32.858552])
    })

    function onMapClick(event) {
        // tıklanan yerin konumuna eriş global değişken aktardım
        coords = [event.latlng.lat, event.latlng.lng];
     form.style.display='flex';
     form[0].focus()
    }

    noteList.addEventListener("click",(e)=>{

      const found_id =  e.target.closest("li").dataset.id
      if(e.target.id==="delete" && confirm("silmek istediğinize eminmisiniz")){
        notes=notes.filter((note)=>note.id != found_id)
        setStorage(notes);
        renderNoteList(notes)
      }  


      if(e.target.id==="fly"){
       const note= notes.find((note)=>note.id==found_id)

       map.flyTo(note.coords)
      }
    })