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
  trainOnly: false,
  museumOnly: false,
};

//When loading the page we want to be on paris (map focus, weather info ...)
initialisation();

function initialisation() {
  document.getElementById("city-select").selectedIndex = 0;
  populateCitySelect();
  cityChange();
  populateTrainSelect();
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
  if (dicoFilter["trainOnly"] == true) {
    query =
      query +
      `MINUS {
        ?x rdf:type ns1:Museum .
      }
    `;
  }
  if (dicoFilter["museumOnly"] == true) {
    query =
      query +
      `MINUS {
        ?x rdf:type ns1:TrainStation .
      }
    `;
  }
  query = query + "}";

  var queryUrl =
    `http://localhost:3030/triple2/query?query=` + query + "&format=json";
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
          marker
            .bindPopup(
              "\n🏛️ Musée:<br /> " +
                x.name.value +
                "<br />" +
                "Localisation: " +
                x.loc.value +
                "<br />" +
                "City: " +
                x.city.value +
                "<br />" +
                "Department: " +
                x.dpt.value +
                "<br />" +
                "Zipcode: " +
                x.zip.value +
                "<br />" +
                "Longitude: " +
                x.longitude.value +
                "<br />" +
                "Latitude: " +
                x.latitude.value +
                "<br />"
            )
            .addTo(map);
        } else {
          var marker = L.marker([x.latitude.value, x.longitude.value], {
            icon: blueIcon,
          });
          Lmarker.push(marker);
          marker
            .bindPopup(
              "🚉 Gare:<br />" +
                x.name.value +
                "<br />" +
                "Department: " +
                x.dpt.value +
                "<br />" +
                "City: " +
                x.city.value +
                "<br />" +
                "Zipcode: " +
                x.zip.value +
                "<br />" +
                "Longitude: " +
                x.longitude.value +
                "<br />" +
                "Latitude: " +
                x.latitude.value +
                "<br />" +
                "Wifi: " +
                x.wifi.value +
                "<br />" +
                "Number of users per year: " +
                x.nbu.value +
                "<br />"
            )
            .addTo(map);
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
    `http://localhost:3030/triple2/query?query=` + query + "&format=json";
  var city_query = await fetch(queryUrl)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let outcome = JSON.parse(text);
      return outcome["results"]["bindings"];
    });

  select = document.getElementById("city-select");
  for (let i = 0; i < city_query.length; i++) {
    var opt = document.createElement("option");
    opt.value = city_query[i]["city"]["value"];
    opt.innerHTML = city_query[i]["city"]["value"];
    select.appendChild(opt);
  }
}

async function populateTrainSelect() {
  var query = encodeURIComponent(`
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX ns1: <http://www.semanticweb.org/sebastien/ontologies/2022/2/untitled-ontology-22#> 
    
    SELECT distinct ?name ?id_gare
    WHERE{
      ?x rdf:type ?TrainStation.
      ?x ns1:name ?name .
      ?x ns1:id_gare ?id_gare.

    }
    ORDER BY ASC(?name)`);

  var queryUrl =
    `http://localhost:3030/triple2/query?query=` + query + "&format=json";
  var train_query = await fetch(queryUrl)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let outcome = JSON.parse(text);
      return outcome["results"]["bindings"];
    });

  const select1 = document.getElementById("trainStation1-select");
  const select2 = document.getElementById("trainStation2-select");
  for (let i = 0; i < train_query.length; i++) {
    var opt = document.createElement("option");
    opt.value = train_query[i]["id_gare"]["value"];
    opt.innerHTML = train_query[i]["name"]["value"];
    select2.appendChild(opt);
  }
  for (let i = 0; i < train_query.length; i++) {
    var opt = document.createElement("option");
    opt.value = train_query[i]["id_gare"]["value"];
    opt.innerHTML = train_query[i]["name"]["value"];
    select1.appendChild(opt);
  }
}

function SNCF(latitude, longitude) {
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

async function download() {
  let city = document.getElementById("city-select").value;
  var query = encodeURIComponent(`
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX ns1: <http://www.semanticweb.org/sebastien/ontologies/2022/2/untitled-ontology-22#> 
  
  CONSTRUCT {
    ?x ?p ?o.
    }
    WHERE {
    ?x rdf:type ?type.
    ?type rdfs:subClassOf* ns1:Place.
    ?x ns1:city "${city}".
    ?x ?p ?o.
    }`).replace(/\n/g, "");
  var queryUrl = `http://localhost:3030/triple2/query?query=` + query;
  var city_query_construct = await fetch(queryUrl).then(function (response) {
    return response.text();
  });
  console.log(city_query_construct);

  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(city_query_construct)
  );
  element.setAttribute("download", "city.txt");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
document.getElementById("dwn-btn").addEventListener(
  "click",
  function () {
    download();
  },
  false
);

document
  .getElementById("trip-btn")
  .addEventListener("click", async function () {
    var trajet = "";
    let trainStation1Id = document.getElementById("trainStation1-select").value;
    let trainStation2Id = document.getElementById("trainStation2-select").value;
    console.log(trainStation1Id + " " + trainStation2Id);
    var url = `https://api.navitia.io/v1/coverage/sncf/journeys?from=${trainStation1Id}&to=${trainStation2Id}&datetime=${getDate()}`;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader(
      "Authorization",
      "5b3cc55f-1fec-4bd9-8e09-957b4de0c84b"
    );
    xhr.send();
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        let temp = JSON.parse(xhr.responseText);
        if (temp.journeys) {
          str = "";
          var jsonld = "";
          for (let i = 0; i < temp.journeys.length; i++) {
            str +=
              "\n🔹Option " +
              (i + 1).toString() +
              ":" +
              "\n" +
              "🔻Departure date: " +
              toDate(temp.journeys[i].departure_date_time) +
              "\n";
            str +=
              "🔺Arrival date: " +
              toDate(temp.journeys[i].arrival_date_time) +
              "\n";
            str +=
              "🕔Travel time: " +
              travelTime(
                toDate(temp.journeys[i].departure_date_time),
                toDate(temp.journeys[i].arrival_date_time)
              ) +
              " h" +
              "\n";
            str +=
              "🚉Number of transferts: " + temp.journeys[i].nb_transfers + "\n";
            str += "📢Comment: " + temp.journeys[i].type + "\n";
            jsonld += newJSONLD(
              i,
              toDate(temp.journeys[i].departure_date_time),
              toDate(temp.journeys[i].arrival_date_time),
              travelTime(
                toDate(temp.journeys[i].departure_date_time),
                toDate(temp.journeys[i].arrival_date_time)
              ) + " h",
              temp.journeys[i].type
            );
          }
          alert(str);
          jsonld += "<\\script>";
          console.log(jsonld);
          download("JSON_LD_travel",jsonld)
        } else {
          console.log("💥No result found💥");
        }
      }
    };
  });

function getDate() {
  var date = new Date();
  date = date.toISOString().replace("-", "");
  date = date.replace("-", "");
  date = date.replace(":", "");
  date = date.replace(":", "");
  date = date.split(".")[0];
  return date;
}

function toDate(date) {
  newdate = date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3);
  newdate += "-" + date.charAt(4) + date.charAt(5);
  newdate += "-" + date.charAt(6) + date.charAt(7);
  newdate += " " + date.charAt(9) + date.charAt(10);
  newdate += ":" + date.charAt(11) + date.charAt(12);
  newdate += ":" + date.charAt(13) + date.charAt(14);
  return newdate;
}

function travelTime(start, end) {
  start = new Date(start);
  end = new Date(end);
  console.log(end);
  dif = Math.abs(end - start) / 36e5;
  return Math.round(dif * 100) / 100;
}

function newJSONLD(i, startTime, endTime, duration, description) {
  var string = "";
  if (i != 0) {
    string += ",";
  } else {
    string += '<script type="application/ld+json">';
  }
  string += `
   {
      "@context":"https://schema.org",
      "@type":"TravelAction",
      "fromLocation":{
        "@type":"City",
        "name":"${
          document.getElementById("trainStation1-select").options[
            document.getElementById("trainStation1-select").selectedIndex
          ].text
        }"
      },
      "toLocation":{
        "@type":"City",
        "name":"${
          document.getElementById("trainStation2-select").options[
            document.getElementById("trainStation2-select").selectedIndex
          ].text
        }"
      },
      "startTime:{
        "@type":"DateTime"
        "Value":${startTime}
      },
      "endTime":{
        "@type":"DateTime"
        "Value":${endTime}
      },
      "bookingTime":{
        "@type":"DateTime"
        "Value":${duration}
      },
      "description":{
        "@type":"Text",
        "Value":"${description}"
      }
   }
   `;
  return string;
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
