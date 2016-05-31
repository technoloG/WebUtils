// UB Speech
// 50 Biomedical Education Building, Buffalo, NY 14214
// 42.954413,-78.815816

// Buff. State Speech (Ketchum Hall 209)
// 1300 Elmwood Ave, Buffalo, NY 14222
// 42.932665,-78.876990


/** BingMapsControl **/

(function () {
    "use strict";

    var BingMapsControl = function () {
        return new LibBingMaps();
    };

    var LibBingMaps = function () {
        var self = this;

        // Public Wire Configuration
        self.config = {
            // Replace the following string with the Bing Maps Key you received from the
            // Bing Maps Account Center http://www.bingmapsportal.com
            BingMapsKey: "INSERT_BING_MAPS_KEY",

            // Replace the following string with the AppId you received from the
            // Bing Developer Center.
            AppId: "INSERT_BING_APPLICATION_ID"
        };

        // Initialize the map control
        var map = null;

        var mapOptions = {};
        var mapViewOptions = {};

        var locationCoordinates = {
            latitude: 0.000,
            longitude: 0.000
        };

        return self;
    };

    if (!window.BingMapsControl) {
        window.BingMapsControl = new BingMapsControl;
    }

    /*
    if(typeof(BingMapsControl) === 'undefined') {
    window.BingMapsControl = BingMapsControl;
    }
    */

    BingMapsControl.VERSION = "1.0.0";
})();



// Bing Maps API
function GetMap(location) {
    if (location == null) {
        location = {
            latitude: 42.95681,
            longitude: -78.88562
        };
    }

    var map = null;
    var mapOptions = {
        // TODO: abstract
        credentials: "ApwsHf4bCtb-4jgDMljIeSddhb5ub0r1_rebI3I8Xl-9ikqPkSvnqAQ-rlzgbPwV"
    };

    var mapViewOptions = {
        showScalebar: false,
        zoom: 15,
        mapTypeId: Microsoft.Maps.MapTypeId.road, // road, aerial, streetside
        //mapTypeId: "r"

        // TODO: get center from current location
        //center: new Microsoft.Maps.Location(42.95681, -78.88562)
        center: new Microsoft.Maps.Location(location.latitude, location.longitude)
    };

    if ((typeof(map) != "undefined") && (map != null)) {
        map.dispose();
        map = null;
    }
    map = new Microsoft.Maps.Map(document.getElementById("mapControl"), mapOptions);

    // Add handler for the map click event.
    Microsoft.Maps.Events.addHandler(map, "click", mapClicked);

    // Add a handler that will grey out other pins in the collection when a new one is added
    Microsoft.Maps.Events.addHandler(map.entities, "entityadded", shadePins);

    // Hide the infobox when the map is moved.
    Microsoft.Maps.Events.addHandler(map, "viewchange", hideInfobox);

    return map;
};

// eventually move to library object, reference with "this"
var mapControl = null;
var currentLocation = {};
var noPins = true; // eventually make a check to verify if collection contains pins
var pinInfobox = null; 

// goal is to create a singleton Map upon initialization
function InitializeMapControl() {

    // Get Current Location
    GetLocation(currentLocationSuccess);
};

function currentLocationSuccess(position) {
    // global modification
    currentLocation.latitude = position.coords.latitude;
    currentLocation.longitude = position.coords.longitude;
    currentLocation.accuracy = position.coords.accuracy;

    SetMapView();
};

function SetMapView() {
    // Get Map
    mapControl = GetMap(currentLocation);
    //mapControl = GetMap(GetLocation(currentLocationSuccess));

    // Set Initial Map View
    var mapView = {
        zoom: 15,
        center: new Microsoft.Maps.Location(currentLocation.latitude, currentLocation.longitude)
    }
    mapControl.setView(mapView);

    // Set Initial Query
    var queryTerm = "coffee";
    var distance = 10;

    //searchBingPhonebook(currentLocation, queryTerm, distance);

    // Get Static Image
    getStaticMapImage(currentLocation);
};

// Event Handlers
function mapClicked(e) {
    console.log("map clicked...");
    if (e.targetType == "map") {
        console.log(" target is map");

        var point = new Microsoft.Maps.Point(e.getX(), e.getY());
        var loc = e.target.tryPixelToLocation(point);

        // map actions
        displayLocation(loc);
        addPin(loc);
//        addShape(loc, 40, new Microsoft.Maps.Color(100, 100, 0, 100));
    }
}

function displayLocation(loc) {
    document.getElementById("output").innerHtml = "" + loc.latitude + ", " + loc.longitude;
}

// Pushpins
function addPin(loc, showInfobox) {
    var pin = new Microsoft.Maps.Pushpin(loc);

    console.log("adding pin: " + loc.latitude + ", " + loc.longitude);
 
    // Add the pushpin to the map
    mapControl.entities.push(pin);

    // Center the map on the location
//    map.setView({center: loc, zoom: 10});

    showInfobox = (typeof showInfobox == "undefined" ? false : showInfobox);

    if(showInfobox) {
        console.log(" showing info box...");
        addPinInfobox(pin);
    }
}

function removePin(e)
{
    var indexOfPinToRemove = map.entities.indexOf(e.target);

    map.entities.removeAt(indexOfPinToRemove);
}

function addPinInfobox(pin) {
    var pinOffset = new Microsoft.Maps.Point(0,15);

    // Create the infobox for the pushpin
    pinInfobox = new Microsoft.Maps.Infobox(pin.getLocation(), 
        {
            title: "Pushpin Info", 
            description: "This pushpin is located at (0,0).", 
            visible: false, 
            offset: pinOffset
        }
    );

    // Add the infobox to the map
    mapControl.entities.push(pinInfobox);

    // Add handler for the pushpin click event.
    Microsoft.Maps.Events.addHandler(pin, "click", displayInfobox);
}

function shadePins(e) {
    // Possibly check collection for entities
    //var noPins = (e.collection.getLength <= 1);

    console.log("shading pins... ");

    if (noPins) {   
        console.log(" no pins yet");

        // If there aren't yet any pins on the map, do not grey the pin out.
        noPins = false;
    }
    else {
        console.log(" pins found " + e.collection.getLength());

        var pin = null;

        // Loop through the collection of pushpins on the map and grey out 
        //    all but the last one added (which is at the end of the array).
        var i = 0;
        for (i = 0; i < e.collection.getLength() - 1; i++) 
        {
            pin = e.collection.get(i);
            pin.setOptions({ icon: "GreyPin.png" });                      
        }
    }
}

function addShape(loc, distance, color) {
    // Create a polygon 
    var vertices = new Array(new Microsoft.Maps.Location(20,-20), new Microsoft.Maps.Location(20,20), new Microsoft.Maps.Location(-20,20), new Microsoft.Maps.Location(-20,-20), new Microsoft.Maps.Location(20,-20));
    var polygoncolor = new Microsoft.Maps.Color(100,100,0,100);
    var polygon = new Microsoft.Maps.Polygon(vertices,{fillColor: polygoncolor, strokeColor: polygoncolor});
            
    // Add the polygon to the map
    mapControl.entities.push(polygon);

    // Get the current color, change color options
    var currentColor = polygon.getFillColor();
    polygon.setOptions({fillColor: green, strokeColor: green});
}

function displayInfobox(e) {
    if (pinInfobox != null) {
        pinInfobox.setOptions({ visible:true });
    }
}                    

function hideInfobox(e) {
    if (pinInfobox != null) {
        pinInfobox.setOptions({ visible: false });
    }
}

// Zoom
function SetZoom() {
    var zoomLevel = parseInt(document.getElementById("mapZoom").value);

    SetZoomLevel(zoomLevel);
};

function SetZoomLevel(level) {
    mapControl.setView({zoom: level});
};

function SetMapType() {
    var mapType = document.getElementById("mapType").value;

    SetMapTypeId(mapType);
}

function SetMapTypeId(id) {
    mapControl.setView({mapTypeId: id});
};


// Method for executing script directly in DOM
function CallRestService(request) 
{
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", request);
    document.body.appendChild(script);
};


// Bing Maps REST Services

// Bing Maps REST implementation
function CallBingMapsRestService(api, query, callback) {
    var baseUrl = "http://dev.virtualearth.net/REST/v1/"
    var jsonp = "&output=json&jsonp=" + callback;
    var requestUrl = baseUrl + api + query + "&key=" + "ApwsHf4bCtb-4jgDMljIeSddhb5ub0r1_rebI3I8Xl-9ikqPkSvnqAQ-rlzgbPwV";

    console.log("calling Bing Maps REST service " + requestUrl);

    $.ajax({
        url: requestUrl,
        dataType: "jsonp",
        jsonp: "jsonp",
        success: function (r) {
            callback(r);
        },
        error: function (e) {
            console.log("request completed unsuccessfully with " + e.status + ': ' +  e.statusText);
        }
    });
};

// Locations: Geocoding
function GeocodeLocation()
{
    var location = document.getElementById("txtLocation").value;

    //mapControl.getCredentials(geocodeRequest);
    geocodeRequest(location);
}

function geocodeRequest(location)
{
    var api = "Locations";

    var query = "?q=" + encodeURI(location);

    //CallRestService(geocodeRequest);
    CallBingMapsRestService(api, query, geocodeComplete);
}

function geocodeComplete(result) 
{
    console.log("Found location: " + result.resourceSets[0].resources[0].name);

    if (result &&
        result.resourceSets &&
        result.resourceSets.length > 0 &&
        result.resourceSets[0].resources &&
        result.resourceSets[0].resources.length > 0) 
    {
        // Set the map view using the returned bounding box
        var bbox = result.resourceSets[0].resources[0].bbox;
        var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));
        mapControl.setView({ bounds: viewBoundaries});

        // Add a pushpin at the found location
        var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
        var pushpin = new Microsoft.Maps.Pushpin(location);

        mapControl.entities.push(pushpin);
    }
}

// Locations: Reverse Geocoding
function ReverseGeocodeLocation() {
    var latitude = document.getElementById("txtLatitude").value;
    var longitude = document.getElementById("txtLongitude").value;

    //mapControl.getCredentials(reverseGeocodeRequest);
    reverseGeocodeRequest(latitude, longitude);
};

function reverseGeocodeRequest(latitude, longitude) {
    var api = "Locations" + "/";

    var query = "" + latitude + "," + longitude + "?incl=ciso2";

    CallBingMapsRestService(api, query, reverseGeocodeComplete);
};

function reverseGeocodeComplete(result) {
    console.log("Found place: " + result.resourceSets[0].resources[0].address.formattedAddress);
};

// Elevations
function GetElevations() {
    var boundingBox = mapControl.getBounds();

    //mapControl.getCredentials(trafficIncidentsRequest);
    elevationsRequest(boundingBox);
};

function elevationsRequest(boundingBox) {
    var api = "Elevation" + "/" + "Bounds";

    var bounds = ""
     + boundingBox.getNorth() + ","
     + boundingBox.getEast() + ","
     + boundingBox.getSouth() + ","
     + boundingBox.getWest();
    var query = "" + "?" + "bounds=" + bounds;

    CallBingMapsRestService(api, query, elevationsComplete);
};

function elevationsComplete(result) {
    console.log("Got elevations.");
};

// Imagery
function getStaticMapImage(position) {
    var baseUrl = "http://dev.virtualearth.net/REST/v1/";
    var api = "Imagery/Map/";
    var type = "Road/";

    var apiKey = "";
    var zoomLevel = 15;

    var mapWidth = 200;
    var mapHeight = 200;

    var requestUrl = baseUrl + api + type + position.latitude + "," + position.longitude + "/" + zoomLevel + "?mapSize=" + mapWidth + "," + mapHeight + "&pp=" + position.latitude + "," + position.longitude + ";22" + "&key=" + apiKey;

    console.log("map image url: " + requestUrl);

    // quick and dirty
    $(".mapStaticImage").attr("src", requestUrl); 
}

function getStaticMapImageComplete(data) {
    
}

// Routes
function CalculateRoute()
{
    var start = document.getElementById("txtStart").value;
    var end = document.getElementById("txtEnd").value;

    //mapControl.getCredentials(calculateRouteRequest);
    calculateRouteRequest(start, end);
}

function calculateRouteRequest(start, end)
{
    var api = "Routes";

    var route = "wp.0=" + encodeURI(start) + "&wp.1=" + encodeURI(end);
    var query = "" + "?" + route + "&routePathOutput=Points";

    var credentials = "";
    var routeRequest = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + start + "&wp.1=" + end + "&routePathOutput=Points&output=json&jsonp=RouteCallback&key=" + credentials;

    CallBingMapsRestService(api, query, calculateRouteComplete);
}

function calculateRouteComplete(result) {
    if (result &&
        result.resourceSets &&
        result.resourceSets.length > 0 &&
        result.resourceSets[0].resources &&
        result.resourceSets[0].resources.length > 0)   {

        // Set the map view
        var bbox = result.resourceSets[0].resources[0].bbox;
        var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));
        mapControl.setView({ bounds: viewBoundaries});

        // Draw the route
        var routeline = result.resourceSets[0].resources[0].routePath.line;
        var routepoints = new Array();
                     
        for (var i = 0; i < routeline.coordinates.length; i++) {
            routepoints[i] = new Microsoft.Maps.Location(routeline.coordinates[i][0], routeline.coordinates[i][1]);
        }
                     
        // Draw the route on the map
        var routeshape = new Microsoft.Maps.Polyline(routepoints, {strokeColor: new Microsoft.Maps.Color(200, 0, 0, 200)});
    
        mapControl.entities.push(routeshape);
    }
}

// Traffic
function GetTrafficIncidents() {
    var boundingBox = mapControl.getBounds();

    //mapControl.getCredentials(trafficIncidentsRequest);
    trafficIncidentsRequest(boundingBox);
};

function trafficIncidentsRequest(boundingBox) {
    var api = "Traffic" + "/" + "Incidents" + "/";

    var bounds = ""
     + boundingBox.getNorth() + ","
     + boundingBox.getEast() + ","
     + boundingBox.getSouth() + ","
     + boundingBox.getWest();
    var query = "" + bounds + "?" + "s=1,2,3,4";

    CallBingMapsRestService(api, query, trafficIncidentsComplete);
};

function trafficIncidentsComplete(result) {
    console.log("Found incidents.");
};


// Bing Maps REST API Modules

// Module: Spatial Math - Distance
function calculateDistance(firstPosition, secondPosition) {
    var distance = 0.000;

    distance = Microsoft.Maps.SpatialMath.getDistance(firstPosition, secondPosition, Microsoft.Maps.SpatialMath.DistanceUnits.Miles);

    return distance;
}

// Module: Search Service
function MapSearchFor() {
    var what = "";
    var where = "";

    search(mapControl, what, where)
}

function search(map, what, where) {
    var searchManager = null;

    // Create an instance of the search manager and perform the search.
    Microsoft.Maps.loadModule("Microsoft.Maps.Search", function () {
        searchManager = new Microsoft.Maps.Search.SearchManager(map);
        //geocodeQuery(map, where, searchManager);
        searchQuery(map, what, where, searchManager);
    });
};

function searchQuery(map, what, where, manager) {
    var location = new Microsoft.Maps.Location(40.71, -74.00);
    var query = "";
    var count = 5;
    var userData = { name: "Richard Nalezynski", id: "123" };

    var searchRequest = {
        what: what,
        where: where,
        count: count,
        callback: searchQueryComplete,
        errorCallback: searchQueryError
    }

    // Make the request.
    //manager.geocode(searchRequest);
    manager.search(searchRequest);
}

function geocodeQuery(map, query, manager) {
    var searchRequest = {
        where: query,
        callback: function (r) {
            if (r && r.results && r.results.length > 0) {
                var pin, pins = [], locs = [], output = 'Results:<br/>';
                for (var i = 0; i < r.results.length; i++) {
                    // Create a pushpin for each result. 
                    pin = new Microsoft.Maps.Pushpin(r.results[i].location, {
                        text: i + ''
                    });
                    pins.push(pin);
                    locs.push(r.results[i].location);
                    output += i + ') ' + r.results[i].name + '<br/>';
                }
                // Add the pins to the map
                map.entities.push(pins);

                // Display list of results
                document.getElementById("output").innerHTML = output;

                // Determine a bounding box to best view the results.
                var bounds;
                if (r.results.length == 1) {
                    bounds = r.results[0].bestView;
                }
                else {
                    // Use the locations from the results to calculate a bounding box.
                    bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
                }
                map.setView({ bounds: bounds });
            }
        },
        errorCallback: function (e) {
            // If there is an error, alert the user about it.
            document.getElementById("output").innerHTML = "No results found.";
        }
    };

    // Make the geocode request.
    manager.geocode(searchRequest);
};

function searchQueryComplete(r) {
    if (r && r.results && r.results.length > 0) {
        var pin, pins = [], locs = [];
        var output = 'Results:<br/>';

        for (var i = 0; i < r.results.length; i++) {
            // Create a pushpin for each result. 
            pin = new Microsoft.Maps.Pushpin(r.results[i].location, {
                text: i + ''
            });
            pins.push(pin);
            locs.push(r.results[i].location);

            output += i + ') ' + r.results[i].name + '<br/>';
        }
        // Add the pins to the map
        map.entities.push(pins);

        // Determine a bounding box to best view the results.
        var bounds;
        if (r.results.length == 1) {
            bounds = r.results[0].bestView;
        }
        else {
            // Use the locations from the results to calculate a bounding box.
            bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
        }
        map.setView({ bounds: bounds });

        // Display list of results
        outputResults(output);
    }
}

function searchQueryError(e) {
    outputResults("No results found.")
}

function outputResults(results) {
    document.getElementById("output").innerHTML = results;
};

function MakeRequest(credentials) {
    
}

// Module: Traffic Service

// Module: Directions Service


// Bing Maps API Modules

// Current Location
function getCurrentPosition()
{
    var geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(mapControl);  
    geoLocationProvider.getCurrentPosition({ successCallback: currentPositionSuccess, errorCallback: currentPositionError }); 
}

function currentPositionSuccess(object)  
{
    alert('Success callback invoked, current map center '  + object.center);
}

function currentPositionError(object)  
{
    alert('Error callback invoked, error code '  + object.errorCode);
}

// Search
var SearchManager = null;

function createSearchManager() 
{
    map.addComponent('searchManager', new Microsoft.Maps.Search.SearchManager(map)); 
    searchManager = map.getComponent('searchManager'); 
    alert('Search module loaded'); 
}
function LoadSearchModule()
{
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: createSearchManager })
}


// Bing Search API

// Bing Search REST Implementation
function callBingService(query, callback) {
    var baseUrl = "http://api.bing.net/json.aspx?";
    var jsonp = "&output=json&jsonp=" + callback;
    var requestUrl = baseUrl + query;

    console.log("calling Bing REST Service " + requestUrl);

    $.ajax({
        url: requestUrl,
        dataType: "jsonp",
        jsonp: "jsonp",
        success: function (r) {
            console.log("request completed successfully with " + r);
            callback(r);
        },
        error: function (e) {
            console.log("request completed unsuccessfully with " + e.status + ': ' +  e.statusText);
        }
    });

};

function requestComplete(response) {
    var errors = response.SearchResponse.Errors;
    if (errors != null) {
        // There are errors in the response. Display error details.
        DisplayErrors(errors);
    }
    else {
        // There were no errors in the response.
        // Display the Phonebook results.
        DisplayResults(response);

        // Update the Map View
        DisplayMapResults(response);
    }
};

function DisplayResults(response) {
    var output = document.getElementById("output");
    var resultsHeader = document.createElement("h4");
    var resultsList = document.createElement("ul");
    output.appendChild(resultsHeader);
    output.appendChild(resultsList);

    var results = response.SearchResponse.Phonebook.Results;

    // Display the results header.
    resultsHeader.innerHTML = "Bing API Version "
            + response.SearchResponse.Version
            + "<br />Phonebook results for "
            + response.SearchResponse.Query.SearchTerms
            + "<br />Displaying "
            + (response.SearchResponse.Phonebook.Offset + 1)
            + " to "
            + (response.SearchResponse.Phonebook.Offset + results.length)
            + " of "
            + response.SearchResponse.Phonebook.Total
            + " results<br />";

    // Display the Phonebook results.
    var resultsListItem = null;
    var resultStr = "";
    for (var i = 0; i < results.length; ++i) {
        resultsListItem = document.createElement("li");
        resultsList.appendChild(resultsListItem);
        resultStr = results[i].Business
                + "<br />"
                + results[i].Address
                + "<br />"
                + results[i].City
                + ", "
                + results[i].StateOrProvince
                + "<br />"
                + results[i].PhoneNumber
                + "<br />Average Rating: "
                + results[i].UserRating
                + "<br /><br />";

        // Replace highlighting characters with strong tags.
        resultsListItem.innerHTML = ReplaceHighlightingCharacters(
                resultStr,
                "<strong>",
                "</strong>");
    }
};

function ReplaceHighlightingCharacters(text, beginStr, endStr) {
    // Replace all occurrences of U+E000 (begin highlighting) with
    // beginStr. Replace all occurrences of U+E001 (end highlighting)
    // with endStr.
    var regexBegin = new RegExp("\uE000", "g");
    var regexEnd = new RegExp("\uE001", "g");

    return text.replace(regexBegin, beginStr).replace(regexEnd, endStr);
};

function DisplayErrors(errors) {
    var output = document.getElementById("output");
    var errorsHeader = document.createElement("h4");
    var errorsList = document.createElement("ul");
    output.appendChild(errorsHeader);
    output.appendChild(errorsList);

    // Iterate over the list of errors and display error details.
    errorsHeader.innerHTML = "Errors:";
    var errorsListItem = null;
    for (var i = 0; i < errors.length; ++i) {
        errorsListItem = document.createElement("li");
        errorsList.appendChild(errorsListItem);
        errorsListItem.innerHTML = "";
        for (var errorDetail in errors[i]) {
            errorsListItem.innerHTML += errorDetail
                    + ": "
                    + errors[i][errorDetail]
                    + "<br />";
        }

        errorsListItem.innerHTML += "<br />";
    }
};

function DisplayMapResults(response) {
    if (response.SearchResponse.Phonebook != null) {
        //Get phonebook results
        var results = response.SearchResponse.Phonebook.Results;

        //Create pushpin collection
        var pushpins = new Microsoft.Maps.EntityCollection();

        //initialize bounds for map area
        var minLatitude = results[0].Latitude; var maxLatitude = results[0].Latitude;
        var minLongitude = results[0].Longitude; var maxLongitude = results[0].Longitude;

        for (var i = 0; i < results.length; ++i) {
            // Add pushpin to map collection
            var pushpinVal = (i + 1).toString();
                pushpins.push(new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(results[i].Latitude, results[i].Longitude), { text: pushpinVal }));

            //Determine bounds that display all pushpins
            if (results[i].Latitude > maxLatitude) {
                maxLatitude = results[i].Latitude;
            }
            else if (results[i].Latitude < minLatitude) {
                minLatitude = results[i].Latitude;
            }

            if (results[i].Longitude > maxLongitude) {
                maxLongitude = results[i].Longitude;
            }
            else if (results[i].Longitude < minLongitude) {
                minLongitude = results[i].Longitude;
            }
        }

        // Create map
        var map = GetMap(currentLocation);

/*
        mapDiv.style.visibility = "visible";
        if (map != null) { map.dispose() };
        map = new Microsoft.Maps.Map(document.getElementById("mapDiv"), { credentials: BingMapsKey, height: 400, width: 400, mapTypeId: "r" });
 */

        // Add pushpins to the map
        map.entities.push(pushpins);

        // Add padding to map area so that pushpins are not on the edge
        minLatitude -= 0.0001;
        maxLatitude += 0.0001;
        minLongitude -= 0.0001;
        maxLongitude += 0.0001;
        var mapArea = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(minLatitude, minLongitude), new Microsoft.Maps.Location(maxLatitude, maxLongitude));
        map.setView({ bounds: mapArea });
    }
};


// Phonebook
function SearchFor() {
    var queryTerm = "";
    var distance = "";

    searchBingPhonebook(location, queryTerm, distance);
};

function searchBingPhonebook(position, query, distance) {
    var queryString = ""

    // Common request fields (required)
    + "AppId=" + ""
    + "&Query=" + query
    + "&Sources=Phonebook"

    // Common request fields 
    + "&Version=2.2"
    + "&Market=en-us"
    + "&UILanguage=en"
    + "&Latitude=" + position.latitude
    + "&Longitude=" + position.longitude
    + "&Radius=" + distance
    + "&Options=EnableHighlighting"

    // Phonebook-specific request fields (optional)
    + "&Phonebook.Count=10"
    + "&Phonebook.Offset=0"
    + "&Phonebook.FileType=YP"
    + "&Phonebook.SortBy=Distance"

    // Set the JSON callback function
    + "&JsonType=callback"
//        + "&JsonCallback=StaticMapResults";
//    + "&JsonCallback=MapResults";
    + "&JsonCallback=searchComplete";

    callBingService(queryString, null);
}

function searchComplete(data) {
    console.log("request complete!");
    requestComplete(data);
}

function Search(lat, long) {
    //Get the distance to search selected by the user
    var distance = document.getElementById('distance').value;

    queryString = document.getElementById('queryTerm').value;
    if ((queryString != null) && (queryString != "Insert search term")) {
        var requestStr = "http://api.bing.net/json.aspx?"

        // Common request fields (required)
        + "AppId=" + AppId
        + "&Query=" + queryString
        + "&Sources=Phonebook"

        // Common request fields 
        + "&Version=2.0"
        + "&Market=en-us"
        + "&UILanguage=en"
        + "&Latitude=" + lat
        + "&Longitude=" + long
        + "&Radius=" + distance
        + "&Options=EnableHighlighting"

        // Phonebook-specific request fields (optional)
        + "&Phonebook.Count=10"
        + "&Phonebook.Offset=0"
        + "&Phonebook.FileType=YP"
        + "&Phonebook.SortBy=Distance"

        // Set the JSON callback function
        + "&JsonType=callback"
//        + "&JsonCallback=StaticMapResults";
        + "&JsonCallback=MapResults";

        var output = document.getElementById("output");

        // Make URL service request
        MakeServiceRequest(requestStr);
    }
    else {
        // The query string is undefined.
        document.getElementById("output").innerHTML = "";
        var output = document.getElementById("output");
        var resultsHeader = document.createElement("h4");
        output.appendChild(resultsHeader);
        resultsHeader.innerHTML = "Please enter a query string.";
    }
};
