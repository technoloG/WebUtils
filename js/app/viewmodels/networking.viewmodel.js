var NetworkingViewModel = function () {
    var self = this;

    var tokenKey = "accessToken";

    self.result = ko.observable();
    self.user = ko.observable();

    self.results = ko.observable("(results)");

    self.localPath = ko.observable("data/");
    self.fileName = ko.observable("items.json");

    // Login
    self.loginEmail = ko.observable();
    self.loginPassword = ko.observable();

    // Registration
    self.registerFirstName = ko.observable("");
    self.registerLastName = ko.observable("");
    self.registerEmail = ko.observable("");
    self.registerPassword = ko.observable("");
    self.registerPassword2 = ko.observable("");
    self.registerPasswordsMatch = ko.pureComputed(computePasswordsMatch, this);
    self.registerDisplayName = ko.pureComputed(computeDisplayName, this);

    // Authentication
    self.register = userSignup;
    self.login = userSignin;
    self.logout = userSignout;

    // Data
    self.query = queryApi;
    self.load = loadData;
}

function computeDisplayName() {
    var self = this;

    var lastInitial = "";

    if (((self.registerLastName() != undefined) || (self.registerLastName() != "null")) && (self.registerLastName() != ""))
    {
        lastInitial = self.registerLastName().charAt(0) + "."; 
    }

    // return first name plus last initial
    return self.registerFirstName() + " " + lastInitial;
}

function computePasswordsMatch() {
    var self = this;

    // compare strings of object
    return self.registerPassword().toString() === self.registerPassword2().toString();
}


// Networking: User Authentication
function userSignup() {
    var self = this;

    // Get Form Data ready to pass over to API
    var formData = {
        Email: self.registerEmail(),
        Password: self.registerPassword(),
        ConfirmPassword: self.registerPassword2()
    };

    // call API with Form Data
    SessionVM.userRegister(formData);
}

function userSignin() {
    var self = this;

    // Get Form Data ready to pass over to API
    var formData = {
        grant_type: 'password',
        username: self.loginEmail(),
        password: self.loginPassword()
    };

    // call API with Form Data
    SessionVM.userLogin(formData);
}

function userSignout() {
    var self = this;

    // call API to clear out any tokens
    SessionVM.userLogout();
}

// Networking: Data
function queryApi() {
}

function queryApiComplete() {
    
}

function loadData() {
    var self = this;

    NetUtils.getLocalData(self.localPath(), self.fileName(), loadDataComplete, self);

//    NetUtils.getData(localPath, data, loadDataComplete);
}

function loadDataComplete(data) {
    var self = this;

    self.results(JSON.stringify(data));
}

var NetworkingVM = new NetworkingViewModel();
ko.applyBindings(NetworkingVM);
