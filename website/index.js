//Paris
var lat = 48.856614;
var lon = 2.3522219;
//Initialization of the map;
var map = L.map('map').setView([lat, lon], 6);;
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 12,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2ViYnVxdWV0IiwiYSI6ImNsMHY3c3o1MjBsbDAzYnBlNTEwdHR1d2kifQ.0wn9bSrhBOnr2H7SJjajxg'
}).addTo(map)

const test =async function()
{
	var greenIcon = new L.Icon({
	  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
	  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	  iconSize: [25, 41],
	  iconAnchor: [12, 41],
	  popupAnchor: [1, -34],
	  shadowSize: [41, 41]
	});

	var blueIcon = new L.Icon({
	  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	  iconSize: [25, 41],
	  iconAnchor: [12, 41],
	  popupAnchor: [1, -34],
	  shadowSize: [41, 41]
	});
	
	var query =encodeURIComponent(`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX ns1: <http://www.semanticweb.org/sebastien/ontologies/2022/2/untitled-ontology-22#> PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> SELECT ?name ?lon ?lat ?name ?nbu ?wifi WHERE {?s rdf:type ?type. ?type rdfs:subClassOf* ns1:Place. ?s ns1:longitude ?lon. ?s ns1:latitude ?lat. ?s ns1:City ?city. ?s ns1:name ?name. OPTIONAL {?s ns1:numberOfUsers ?nbu. }. OPTIONAL {?s ns1:wifi ?wifi .}.}`);
	var queryUrl = `http://localhost:3030/triple/query?query=`+ query+"&format=json"
	var finalValue= await fetch(queryUrl)
	.then(function (response) {
		return response.text();})
	.then(function (text) {
		let outcome = JSON.parse(text);
		console.log(outcome)
		outcome.results.bindings.forEach(x => {
		if (x.name.value.includes("musée"))
		{
			var marker = L.marker([x.lat.value,x.lon.value], {icon: greenIcon})
			marker.bindPopup(x.name.value).addTo(map) ;
		}
		else{
			console.log("passe")
			var marker = L.marker([x.lat.value,x.lon.value], {icon: blueIcon})
			marker.bindPopup(x.name.value).addTo(map) ;
		}
		
		}
		)
		})
		
}
test()
var popup = L.popup();

async function onMapClick(e) {
	
	

    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

