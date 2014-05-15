exports.registerRoutes = function(app, parse) {
	var utasnaps = "UTA Snaps ";
	var indexRoute = function(req, res){
	    res.render("index", {page:"index", title: utasnaps + "Image Gallery"});
	};
	app.get('/', indexRoute);
	var uploadRoute = function(req,res){
	    res.render("upload", {page:"upload", title: utasnaps + "Image Upload"});
	};
	app.get('/upload', uploadRoute);
	var signupRoute = function(req,res){
	    res.render("signup", {page:"signup", title: utasnaps + "Signup"});
	};
	app.get('/signup', signupRoute);
	var profileRoute = function(req,res){
	    res.render("profile", {page: "profile", title: utasnaps + "User Profile"});
	};
	app.get('/profile', profileRoute);
	var loginRoute = function(req,res){
	    res.render("login", {page: "login", title: utasnaps + "Login"});
	};
	app.get("/login", loginRoute);

	app.post("/login", function(req,res) {
		parse.User.logIn(req.body.username, req.body.password, {
			success: function(user) {
				console.log("User " + req.body.username + " logged in");
				indexRoute(req,res);
			},
			error: function(user, error) {
				// The login failed. Check error to see why.
				console.log("User " + user + " login error " + error.code + ": " + error.message); 
				signupRoute(req, res);
			}
		});
	});
};
