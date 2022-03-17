//Paris
var lat = 48.856614;
var lon = 2.3522219;
//Initialization of the map;
var map = L.map('map').setView([lat, lon], 13);;
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2ViYnVxdWV0IiwiYSI6ImNsMHY3c3o1MjBsbDAzYnBlNTEwdHR1d2kifQ.0wn9bSrhBOnr2H7SJjajxg'
}).addTo(map)
