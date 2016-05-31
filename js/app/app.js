(function () {
    $(document).ready(function () {
        // initialize routing

        // initialize networking
        var wireConfig = {
            networkBaseUri: "http://www.blahblahblah.com",
            localPath: "/data/"
        };
        window.NetUtils.config = wireConfig;

        // initialize maps via Bing
        var mapsConfig = {
            BingMapsKey: "",
            AppId: ""
        };
        window.BingMapsControl.config = mapsConfig;
        //window.BingMapsControl.InitializeMapControl();

        // initialize chart

        // load any data from storage

    });

})();