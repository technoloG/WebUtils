var BaseViewModel = function () {
    var self = this;

    self.bindView = bindView;
}

function bindView(ViewModel, View, bLateBind) {
    bLateBind = (typeof bLateBind == "undefined" ? true : bLateBind);

    console.log("binding view " + View);

    if (isElementBound(View))
    {
        console.log(" already bound, cleaning and re-applying...");
        ko.cleanNode(document.getElementById(View));
    }
    ko.applyBindings(ViewModel, document.getElementById(View));
}

// utility for late binding and checking binding to avoid errors
function lateBind(ViewModel, View) {
    console.log("late binding view" + View);

    if (isElementBound(View))
    {
        console.log(" already bound, cleaning and re-applying...");
        ko.cleanNode(document.getElementById(View));
    }
    ko.applyBindings(ViewModel, document.getElementById(View));
}

// Checks if Element has Already been Bound
// (Stops Errors Occuring if already bound as element can't be bound multiple times)
function isElementBound (id) {
    if (document.getElementById(id) != null)
    {
        console.log(" binding: element " + id + " already bound");
        return !!ko.dataFor(document.getElementById(id));
    }
    else
    {
        console.log(" binding: element " + id + " not bound");
        return false;
    }
};

var baseVM = new BaseViewModel();
