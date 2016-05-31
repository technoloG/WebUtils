// Networking Utilities

(function () {
    "use strict";

    var NetUtils = function () {
        return new LibNetworkingUtilities();
    };

    var LibNetworkingUtilities = function () {
        var self = this;

        var tokenKey = "accessToken";

        // Public Wire Configuration
        self.config = {
            networkBaseUri: "",
            localPath: ""
        };

        // Public Wire API - CRUD
        self.getLocalData = getLocalData;

        // Public Wire API - Authentication and Authorization
        self.register = register;
        self.login = login;
        self.logout = logout;

        return self;
    };

    if (!window.NetUtils) {
        window.NetUtils = new NetUtils;
    }

    /*
    if(typeof(NetUtils) === 'undefined') {
    window.NetUtils = NetUtils;
    }
    */

    LibNetworkingUtilities.VERSION = "1.0.0";


    // Private Wire API functions
    function callAPI(uri, method, data, headers, callback, caller, bUseLocalData) {
        // defaults
        bUseLocalData = (typeof bUseLocalData == 'undefined' ? false : bUseLocalData);

        console.log("calling network uri " + uri);

        var result = ''; // Clear result
        var error = ''; // Clear error message

        $.ajax({
            type: method,
            headers: headers,
            url: uri,
            dataType: "json",
            contentType: "application/json",
            data: data ? JSON.stringify(data) : null
        }).done(function (data) {
            // can't create a function if desire is to handle callback
            requestComplete(data, callback, caller);
        }).fail(requestFailed);
    };

    function requestComplete(data, callback, caller) {
        var result = data;

        if (callback && typeof (callback) === "function") {
            console.log("callback...");
            // don't use callback.call();
            callback.call(caller, data);
        }
    }

    function requestFailed(jqXHR, textStatus, errorThrown) {
        var result = jqXHR.status + ': ' + jqXHR.statusText;

        var error = errorThrown;

        console.log("failed... " + result + ", " + error);
    }

    function showError(jqXHR) {
        var result = jqXHR.status + ': ' + jqXHR.statusText;
    };


    // CRUD operations - Local Data
    function getLocalData(localPath, dataSource, callback, caller) {
        var baseLocalUri = "./" + localPath;

        callAPI(baseLocalUri + dataSource, "GET", {}, {}, callback, caller, true);
    };


    // CRUD operations - Live Data
    function getAllData(Uri, callback, bUseLocalData) {
        callAPI(baseLocalUri + dataSource, "GET", {}, {}, callback, bUseLocalData);
    };

    function getDataDetails(item) {
        //Uri = networkUri + item.Id;
        var Uri = "";

        ajaxHelper(Uri, 'GET').done(function (data) {
            VM.detail(data);
        });
    };

    function getData() {
        var Uri = "";

        var token = sessionStorage.getItem("tokenKey");
        var headers = {};

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
    };

    function updateData() {
        var Uri = "";

        var token = sessionStorage.getItem("tokenKey");
        var headers = {};

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
    };

    function addData() {
        var Uri = "";

        var token = sessionStorage.getItem("tokenKey");
        var headers = {};

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        ajaxHelper(networkUri, 'POST', VM).done(function (item) {
            VM.data.push(item);
        });
    };

    function removeData() {
        Uri = "";

        var token = sessionStorage.getItem("tokenKey");
        var headers = {};

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
    };


    // Authentication
    function register(data, callback, caller) {
        var Uri = "";

        var self = this;

        callAPI(Uri, 'POST', data, {}, callback, caller);
    };

    function login(data, callback) {
        var Uri = "";

        var self = this;

        callAPI(Uri, 'POST', data, {}, callback, caller);
    };

    function logout(callback, caller) {
        callback.call(caller);
    };


    // Test
    function testAPI() {
        var result = '';

        var token = sessionStorage.getItem("tokenKey");
        var headers = {};

        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        $.ajax({
            type: 'GET',
            url: '/api/values',
            headers: headers
        }).done(function (data) {
            self.result(data);
        }).fail(showError);
    }

    function ajaxHelper(uri, method, data, headers) {
        var result = ''; // Clear result
        var error = ''; // Clear error message

        return $.ajax({
            type: method,
            headers: headers,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            result = jqXHR.status + ': ' + jqXHR.statusText;

            error = errorThrown;
        });
    };


    // Logging
    function logNetworkData(data) {
        var innerArray = data.data;

        console.log("network data...");

        $.each(innerArray, function (i, item) {
            console.log(" iteration " + i + " " + item);
        });
    }
})();
