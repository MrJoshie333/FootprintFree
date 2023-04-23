let map;
let markers = [];
let routeMarkers = [];
let coords = [];
let clicks = 0;
let distance = 69;

async function initMap() {

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerView } = await google.maps.importLibrary("marker");
  const rolla = { lat: 37.955544, lng: -91.773513 }

  map = new Map(document.getElementById('map'), {
    zoom: 13,
    center: rolla,
    zoomControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false
  });

  map.addListener("click", (e) => { placeMarker(e.latLng, map); });
  document
    .getElementById("clear-button")
    .addEventListener("click", clearMarkers);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
  markers = [];
  coords = [];
  distance = "";
  if (directionsRenderer) {
    directionsRenderer.setMap(null);
  }
}

function calculateRoute(start, end) {
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();

  directionsRenderer.setMap(map);
  let request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };

  directionsService.route(request, function(result, status) {

    //Draw the route on the map
    directionsRenderer.setDirections(result);

    //Distance is defined right here!
    distanceText = result.routes[0].legs[0].distance.text;
    
    document.getElementById("myText").innerHTML = distanceText;
  });
}

function getNumDistance(stringDistance){
  
  trimmed = stringDistance.replace(',', '');
  
  let value = parseFloat(trimmed.substring(0, trimmed.indexOf(' ')));
  
  if (trimmed.substring(trimmed.indexOf(' ') + 1) == "ft") {
    value = value / 5280;
  }

  return value;
}

function placeMarker(position, map) {
  let marker = new google.maps.Marker({
    position: position,
    map: map,
  });

  map.panTo(position);
  markers.push(marker);
  coords.push(position);

  clicks += 1;

  if (clicks > 2) {
    initMap();
    clicks = 0;
    markers = [];
    coords = [];
    routeMarkers = [];
  }
  calculateRoute(coords[0], coords[1]);

  document.getElementById("anotherThing").innerHTML = distance;
}

//Get Emission Function
function getEmission(distance, gasMileage) {  
  return (distance / gasMileage) * 8887;
} 

//Get Trees Saved Function - WORKS
function calcTreesSaved(emissions) {  
  return 0.4082 * (emissions / 8887);
}

// Get the form and input elements
const form = document.querySelector('form');

// Add an event listener to the form's submit button
// (This block triggers when button is pressed)
document.getElementById('submit-button').addEventListener('click', function(event) {
  event.preventDefault();
  
  // Get the value from the gas mileage input - WORKS
  let gasMileage = parseInt(document.getElementById('gas-mileage-input').value);

  //Convert string distance to a decimal for calculations
  distance = getNumDistance(distanceText);

  //Calculate the other necessary values using their dedicated functions
  let emissions = getEmission(distance, gasMileage);
  let treesSaved = calcTreesSaved(emissions);
    
  // Display the results on the page
  document.getElementById("reshow").innerHTML = distance; 
  document.getElementById("gm").innerHTML = gasMileage; 
  document.getElementById("CO2").innerHTML = emissions / 1000;
  document.getElementById('trees').innerHTML = treesSaved;  
});



// Get the submit button element
// Add a click event listener to the submit button
/*submitButton.addEventListener('click', function() {
  // Get the distance and gas mileage inputs from the DOM
  const distanceInput = document.getElementById('myText');
  
  const gasMileageInput = document.getElementById('gas-mileage-input');

  // Get the values from the distance and gas mileage inputs  
  const distance = parseFloat(distanceInput.value);
  const gasMileage = parseFloat(gasMileageInput.value);

  // Calculate the emissions and trees saved and display them on the page
  let emissions = getEmission(distance, gasMileage);
  //let emissions = 2
  //let gallons = 2;
  let treesSaved = calcTreesSaved(gallons);

  // Display the results on the page
  document.getElementById('CO2').innerHTML = emissions;
  document.getElementById('trees').innerHTML = treesSaved;
  //document.getElementById('test').innerHTML = "Hello";
}); */

