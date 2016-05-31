$(document).ready(init);
$(window).load(load);

function init(jQuery)
{
  CurrentYear();

  CheckStorageSupport();
}

function load()
{
  GetLocation();

  GetStoredData("demo");
}


/** JavaScript: Current Year **/
function CurrentYear() {
  var thisYear = new Date().getFullYear()
  $("#currentYear").text(thisYear);
}


/** HTML5 Storage API **/

var setCookie; 
var getCookie;

var sessionStorageSupported;

function CheckStorageSupport() {
  sessionStorageSupported = (
    //(Modernizr.sessionStorage) || (window.sessionStorage)
    ('sessionStorage' in window && 
    window['sessionStorage'] !== null)
  );

  if (sessionStorageSupported)
  {
    console.log("using session storage");
  
    setCookie = function (cookieName, value)
    {
      window.sessionStorage.setItem(cookieName, value);

      return value;
      // introduce try-catch here if required
    };
  
    getCookie = function (cookieName)
    {
      return window.sessionStorage.getItem(cookieName);
    };
  }
  else
  {
    console.log("using cookies");
  
    setCookie = function (cookieName, value)
    {
      //document.cookie

      // needs jQuery cookie plugin
      //$.cookie(cookieName, value);
      return value; // null if key not present
    };

    getCookie = function (cookieName) {
        alert("returning: " + $.cookie.cookieName);

        // needs jQuery cookie plugin
        //return $.cookie(cookieName);
        return null;
    };
  }
}

function SaveClick()
{
  var value = document.getElementById("txtData").value;
  
  setCookie("demo", value);
}

function LoadClick()
{
  GetStoredData("demo");
}

function GetStoredData(key)
{
  var value = getCookie(key);

  document.getElementById("storage").innerHTML = value;
}


/** HTML5 Geolocation API **/
var locationCoordinates = 
{
  latitude: 47.592,
  longitude: -122.332,
  accuracy: 0
}

var locationOptions = 
{
  enableHighAccuracy: false, 
  maximumAge: 15000, 
  timeout: 30000
}

function GetCurrentLocation() {
    return locationCoordinates;
}

function GetLocation(callback)
{
  if(callback == null) {
      callback = geolocationSuccess;
  }

  // check with Modernizr
  if (Modernizr.geolocation) {
    if(navigator.geolocation) {
      // Geolocation supported. Do something here.
      navigator.geolocation.getCurrentPosition(callback, geolocationError, locationOptions);
    }
  }
}

function geolocationSuccess(position) {
  /* Get the location data */
  locationCoordinates.latitude = position.coords.latitude;
  locationCoordinates.longitude = position.coords.longitude;
  locationCoordinates.accuracy = position.coords.accuracy;

  var output = locationCoordinates.latitude + ", " + locationCoordinates.longitude;

  document.getElementById("coordinates").innerHTML = output;

/* 
  // Save Cookie - local storage

  // Save Cookie - jQuery
  $.cookie("posLat", latitude);
  $.cookie("posLon", longitude);
  $.cookie("posAccuracy", accuracy);
 */
}

function geolocationError(error) {
    switch (error.code) {
        case 0:
            alert("Unknown error :(");
            break;
        case 1:
            alert("Location services are unavailable per your request.");
            break;
        case 2:
            alert("Location data is unavailable.");
            break;
        case 3:
            alert("The location request has timed out. Please contact support if you continue to experience issues.");
            break;
    }
}
