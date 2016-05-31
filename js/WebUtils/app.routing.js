// Routing

function Router(appRoot, contentSelector, defaultRoute) {
    function bind(ViewModel, View) {
        // have the view model bind to the loaded view
        ko.applyBindings(ViewModel, document.getElementById(View));

        //ko.applyBindings(ViewModel, document.getElementById(View));
        //HomeViewModel.update(document.getElementById(View));
    }

    function getUrlFromHash(hash) {
        var url = hash.replace("/#", "");

        if(url === appRoot) {
            url = defaultRoute;
        }

        return url;
    }

    function RenderView(context, callback, path) {
        var separator = ".";
        var extension = "html";

        var url = getUrlFromHash(context.path);

        // path would be something like: "js/app/views/itemsView.html"
        context.render(path + url + "View" + separator + extension, callback);
    }

    function LoadView(context) {
        var url = getUrlFromHash(context.path);

        context.load(url).swap();
    }

    function RunRoute(url) {
        this.get("/\#\(.*)", LoadView);
    }

    function InitializeRoute(contentSelector) {
        var app = Sammy(contentSelector, RunRoute);
    }

    return {
        init: InitializeRoute()
    };
}
