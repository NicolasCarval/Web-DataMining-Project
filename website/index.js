//Paris
var lat = 48.856614;
var lon = 2.3522219;
var Lmarker = new Array();
//Initialization of the map;
var map = L.map("map");
var dicoFilter = {
  wifiOnly: false,
  trafficLow: true,
  trafficMedium: true,
  trafficHigh: true,
};

//When loading the page we want to be on paris (map focus, weather info ...)
initialisation();

function initialisation() {
  document.getElementById("city-select").selectedIndex = 0;
  populateCitySelect();
  cityChange();
}
//Change position on the map
function displayMap(latitude, longitude) {
  map.setView([latitude, longitude], 13);
}
map.setView([lat, lon], 12);
L.tileLayer(
  `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`,
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 11,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoic2ViYnVxdWV0IiwiYSI6ImNsMHY3c3o1MjBsbDAzYnBlNTEwdHR1d2kifQ.0wn9bSrhBOnr2H7SJjajxg",
  }
).addTo(map);

const test = async function () {
  var greenIcon = new L.Icon({
    iconUrl: "museums.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var blueIcon = new L.Icon({
    iconUrl: "transport.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var query =
    encodeURIComponent(`PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ns1: <http://www.semanticweb.org/sebastien/ontologies/2022/2/untitled-ontology-22#> 

SELECT distinct ?name ?longitude ?latitude ?type ?wifi ?nbu ?zip ?dpt ?city ?loc
WHERE {
?x rdf:type ?type.
?type rdfs:subClassOf* ns1:Place.
?x ns1:name ?name.
?x ns1:city ?city.
?x ns1:longitude ?longitude.
?x ns1:latitude ?latitude.
?x ns1:zipCode ?zip.
?x ns1:department ?dpt.
OPTIONAL{?x ns1:numberOfUsers ?nbu}.OPTIONAL{?x ns1:wifi ?wifi}.OPTIONAL{?x ns1:Localisation ?loc}`);

  if (dicoFilter["wifiOnly"] == true) {
    query =
      query +
      `MINUS {
        ?x  ns1:wifi "Non" .
      }
    `;
  }
  if (dicoFilter["trafficLow"] == false) {
    query =
      query +
      `MINUS {
        ?x  ns1:numberOfUsers "low" .
      } 
    `;
  }
  if (dicoFilter["trafficMedium"] == false) {
    query =
      query +
      `MINUS {
        ?x  ns1:numberOfUsers "medium" .
      } 
    `;
  }
  if (dicoFilter["trafficHigh"] == false) {
    query =
      query +
      `MINUS {
        ?x  ns1:numberOfUsers "high" .
      } 
    `;
  }
  query = query + "}";

  var queryUrl =
    `http://localhost:3030/triple/query?query=` + query + "&format=json";
  var finalValue = await fetch(queryUrl)
    .then(function (response) {
      return response.text();
    })  
    .then(function (text) {
      let outcome = JSON.parse(text);
	  console.log(outcome);
      outcome.results.bindings.forEach((x) => {
        if (x.type.value.includes("Museum")) {
          var marker = L.marker([x.latitude.value, x.longitude.value], {
            icon: greenIcon,
          });
          Lmarker.push(marker);
          marker.bindPopup("\n🏛️ Musée:<br /> " + x.name.value+"<br />"
		  +"Localisation: "+x.loc.value+"<br />"
		  +"City: "+x.city.value+"<br />"
		  +"Department: "+x.dpt.value+"<br />"
		  +"Zipcode: "+x.zip.value+"<br />"
		  +"Longitude: "+x.longitude.value+"<br />"
		  +"Latitude: "+x.latitude.value+"<br />"
		  ).addTo(map);
        } else {
          var marker = L.marker([x.latitude.value, x.longitude.value], {
            icon: blueIcon,
          });
          Lmarker.push(marker);
          marker.bindPopup("🚉 Gare:<br />" + x.name.value+"<br />"
		  +"Department: "+x.dpt.value+"<br />"
		  +"City: "+x.city.value+"<br />"
		  +"Zipcode: "+x.zip.value+"<br />"
		  +"Longitude: "+x.longitude.value+"<br />"
		  +"Latitude: "+x.latitude.value+"<br />"
		  +"Wifi: "+x.wifi.value+"<br />"
		  +"Number of users per year: "+x.nbu.value+"<br />"
		  ).addTo(map);
        }
      });
    });
};

test();
var popup = L.popup();

async function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

//WEATHER
function weather(latitude, longitude) {
  var url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ce8847370586f5876e9c7186b725a50c&units=metric`;
  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let answer = JSON.parse(text);
      return answer;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function displayWeather() {
  weather(lat, lon).then(function (json) {
    let city = document.getElementById("city-select").value;
    document.getElementById("weatherCity").innerText = `📍 In : ${city}`;
    document.getElementById(
      "weatherDegree"
    ).innerText = `🌡️ Temperature : ${json.main.temp}°C`;
    document.getElementById(
      "weatherSky"
    ).innerText = `🌥️ Sky : ${json.weather[0].main}`;
    document.getElementById(
      "weatherWind"
    ).innerText = `🌬️ Wind : ${json.wind.speed} Km/h, orientation : ${json.wind.deg}°`;
  });
}

function getCoordCity(city) {
  var url = `https://api-adresse.data.gouv.fr/search/?q=${city}`;
  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let answer = JSON.parse(text);
      return answer.features[0].geometry.coordinates;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function cityChange() {
  let city = document.getElementById("city-select").value;
  getCoordCity(city)
    .then((newCoordinates) => {
      lon = newCoordinates[0];
      lat = newCoordinates[1];
      displayMap(lat, lon);
    })
    .then(displayWeather());
}

async function populateCitySelect() {
  var query = encodeURIComponent(`
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX ns1: <http://www.semanticweb.org/sebastien/ontologies/2022/2/untitled-ontology-22#> 
    
    SELECT distinct ?city
    WHERE{
      ?x rdf:type ?type .
      ?type rdfs:subClassOf* ns1:Place .
      ?x ns1:city ?city .
    }
    ORDER BY ASC(?city)`);

  var queryUrl =
    `http://localhost:3030/triple/query?query=` + query + "&format=json";
  var city_query = await fetch(queryUrl)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let outcome = JSON.parse(text);
      return outcome["results"]["bindings"];
    });

  select = document.getElementById("city-select");
  for (var i = 0; i < city_query.length; i++) {
    var opt = document.createElement("option");
    opt.value = city_query[i]["city"]["value"];
    opt.innerHTML = city_query[i]["city"]["value"];
    select.appendChild(opt);
  }
}

function filterChange(id) {
  var checkBox = document.getElementById(id);
  if (checkBox.checked) {
    dicoFilter[id] = true;
    markerDelAgain();
    test();
  } else {
    dicoFilter[id] = false;
    markerDelAgain();
    test();
  }
}

/*Going through these marker-items again removing them*/
function markerDelAgain() {
  console.log(Lmarker);
  for (i = 0; i < Lmarker.length; i++) {
    map.removeLayer(Lmarker[i]);
  }
  Lmarker = [];
}
