//Paris
var lat = 48.856614;
var lon = 2.3522219;
//Initialization of the map;
var map = L.map('map')

initialisation();

//Change position on the map
function displayMap(latitude, longitude) {
    map.setView([latitude, longitude], 13);
}
map.setView([lat, lon], 12);
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 11,
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
	
	var query =encodeURIComponent(`PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ns1: <http://www.semanticweb.org/sebastien/ontologies/2022/2/untitled-ontology-22#> 



SELECT distinct ?name ?longitude ?latitude
WHERE {
?x rdf:type ?type.
?type rdfs:subClassOf* ns1:Place.
?x ns1:name ?name.
?x ns1:longitude ?longitude.
?x ns1:latitude ?latitude.
}`);
	var queryUrl = `http://localhost:3030/semantic/query?query=`+ query+"&format=json"
	var finalValue= await fetch(queryUrl)
	.then(function (response) {
		return response.text();})
	.then(function (text) {
		let outcome = JSON.parse(text);
		console.log(outcome)
		outcome.results.bindings.forEach(x => {
		if (x.name.value.includes("musée"))
		{
			var marker = L.marker([x.latitude.value,x.longitude.value], {icon: greenIcon})
			marker.bindPopup(x.name.value).addTo(map) ;
		}
		else{
			console.log("passe")
			var marker = L.marker([x.latitude.value,x.longitude.value], {icon: blueIcon})
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



//WEATHER
function weather(latitude, longitude) {
    var url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ce8847370586f5876e9c7186b725a50c&units=metric`
    return fetch(url).then(function (response) {
        return response.text();
        
    }).then(function (text) {
        let outcome = JSON.parse(text);
        return outcome;
    }).catch(function (error) {
        console.log(error);
    });
}

function displayWeather() {
    weather(lat, lon).then(function (json) {
        let city = document.getElementById("city-select").value
        document.getElementById("weatherCity").innerText = `In : ${city}`;
        document.getElementById("weatherDegree").innerText = `Temperature : ${json.main.temp}°C`;
        document.getElementById("weatherSky").innerText = `Sky : ${json.weather[0].main}`;
        document.getElementById("weatherWind").innerText = `Wind : ${json.wind.speed} Km/h, orientation : ${json.wind.deg}°`;
    });    
}

function getCoordCity(city) {
    var url = `https://api-adresse.data.gouv.fr/search/?q=${city}`
    console.log(url)
    return fetch(url).then(function (response) {
        return response.text();
    }).then(function (text) {
        let outcome = JSON.parse(text);
        console.log(outcome)
        return outcome.features[0].geometry.coordinates;
    }).catch(function (error) {
        console.log(error);
    });
}

function initialisation() {
    document.getElementById("city-select").selectedIndex = 0;
    cityChange();
}
function cityChange() {
    let city = document.getElementById("city-select").value
    getCoordCity(city).then(newCoordinates => {
        lon = newCoordinates[0]
        lat = newCoordinates[1]
        console.log(lon, lat)
        displayMap(lat, lon)
    }).then(displayWeather())

}

