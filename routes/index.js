exports.registerRoutes = function(app, Parse) {
	
	function isValidCookie(req, user) {
		return req.cookies.get("uniqueKey", {signed: true}) == user.get("uniqueKey");
	}

	function mix(target, source) {
   		for(var key in source) {
     		if (source.hasOwnProperty(key)) {
        		target[key] = source[key];
     		}
   		}
	}

	var utasnaps = "UTA Snaps ";
	function verifyLoginCookieAndSendPage(req, res, page, pageName, data) {
		var username = req.cookies.get("username");
		var pageData = {
			page: page, 
			username: username, 
			title: utasnaps + pageName
		};

		if (typeof data == "object") {
			mix(pageData, data);
		}

		if (username)
		{		
			var query = new Parse.Query(Parse.User);
			query.equalTo("username", username);
			query.first({
				success: function(user) {
					if (isValidCookie(req, user)) {
						res.render(page, pageData);
						console.log("Verified cookie for user " + username);
					} else {
						pageData.username = "anonymous";
						res.render(page, pageData);
						console.log("Couldn't verify cookie for user " + username);
					}
				},
				error: function(error) {
					pageData.username = "anonymous";
					res.render(page, pageData);
					console.log(username + " not found in Parse Users, error " + error.code + 
						": " + error.message);
				}
			});
		}
		else
		{
			pageData.username = "anonymous";
			res.render(page, pageData);
			console.log("Anonymous user connected");
		}
	}

	app.get('/', function (req, res) {
		verifyLoginCookieAndSendPage(req, res, "index", "Image Gallery");
	});

	app.get('/upload', function (req,res) {
		verifyLoginCookieAndSendPage(req, res, "upload", "Image Upload");	
	});

	app.get('/signup', function (req,res) {
		verifyLoginCookieAndSendPage(req, res, "signup", "Signup");
	});

	app.get('/profile', function (req,res) {
		var username = req.cookies.get("username");

		// Get private user info
		var q = new Parse.Query(Parse.User);
		q.equalTo("username", username);
		q.first({
			success: function (result) {
				var userInfo = {
					email: result.get("email"),
					major: result.get("major"),
					emailVerified: result.get("emailVerified")
				};
				verifyLoginCookieAndSendPage(req, res, "profile", "User Profile", userInfo);
			},
			error: function(error) {
				// No user info to send, so redirect to login page 
				// (they shouldn't be here anyways)
				res.location("/login");
				res.redirect("/login");
			}
		});	
	});

	app.post("/profile/update/email", function (req, res) {
		var q = new Parse.Query(Parse.User).equalTo("username", req.cookies.get("username"));
		q.first({
			success: function(user) {
				if (isValidCookie(req, user)) {
					Parse.User.become(req.cookies.get("sessionToken")).then(function (user) {
						user.setEmail(req.body.email);
						user.save(null, {
							success: function (user) {
								console.log("User " + user.get("username") + " updated email to " 
									+ req.body.email);
								res.location("/profile");
								res.redirect("/profile");
							}, 
							error: function (user, error) {
								console.log("Failed saving user " + user.get("username")
									+ " email address, error " + error.code + ": " + 
									error.message);
								res.location("/profile");
								res.redirect("/profile");
							}
						});
					}, function (error) {
						// no cookie?
						res.location("/login");
						res.redirect("/login");
					});
					
				}
				else
				{
					// Not a valid token. Punt it.
					res.location("/logout");
					res.redirect("/logout");
				}
			},
			error: function(error) {
				// Not a valid user. Punt it.
				res.location("/logout");
				res.redirect("/logout");
			}
		});
	});

	app.post("/profile/update/major", function (req, res) {
		var q = new Parse.Query(Parse.User).equalTo("username", req.cookies.get("username"));
		q.first({
			success: function(user) {
				if (isValidCookie(req, user)) {
					Parse.User.become(req.cookies.get("sessionToken")).then(function (user) {
						user.set("major", req.body.major);
						user.save(null, {
							success: function(user) {
								console.log("User " + user.get("username") + " updated major to "
								 	+ req.body.major);
								res.location("/profile");
								res.redirect("/profile");		
							},
							error: function(user, error) {
								console.log("User " + user.get("username") + " error updating major: " 
									+ error.code + ": " + error.message);
								res.location("/profile");
								res.redirect("/profile");
							}
						});	
					}, function (error) {
						console.log("Error becoming user " + user.get("username") 
							+ ": " + error.code + " - " + error.message);
					});
				}
				else
				{
					// Not a valid token. Punt it.
					res.location("/logout");
					res.redirect("/logout");
				}
			},
			error: function(error) {
				// Not a valid user. Punt it.
				res.location("/logout");
				res.redirect("/logout");
			}
		});
	});

	app.post("/profile/update/password", function (req, res) {
		var q = new Parse.Query(Parse.User).equalTo("username", req.cookies.get("username"));
		q.first({
			success: function(user) {
				if (isValidCookie(req, user)) {
					Parse.User.become(req.cookies.get("sessionToken")).then(function (user) {
						user.setPassword(req.body.password);
						user.save(null, {
							success: function(user) {
								console.log("User " + user.get("username") + " updated password");
								res.location("/profile");
								res.redirect("/profile");
							},
							error: function(user, error) {
								console.log("Password Save Error " + error.code + ": " 
									+ error.message);
								res.location("/profile");
								res.redirect("/profile");
							}
						});						
					}, function (error) {
						console.log("Failed to authenticate user session token, Error " 
							+ error.code + ": " + error.message);
					});
				}
				else
				{
					// Not a valid token. Punt it.
					res.location("/logout");
					res.redirect("/logout");
				}
			},
			error: function(error) {
				// Not a valid user. Punt it.
				res.location("/logout");
				res.redirect("/logout");
			}
		});
	});	

	app.get("/logout", function (req,res){
		res.cookies.set("username");
		res.cookies.set("uniqueKey");
		res.cookies.set("sessionToken");
		res.location("/");
		res.redirect("/");
	});

	app.post("/signup", function(req,res){
		var user = new Parse.User();
        user.set("username", req.body.username);
        user.set("password", req.body.password);
        user.set("email", req.body.email);
        user.set("major", req.body.major);
        user.signUp(null, {
        	success: function(user) {
        		console.log("User " + user.attributes.username + " signed up");
        		res.location("/login");
        		res.redirect("/login");
        	}, 
        	error: function(user, error) {
        		console.log("User " + user.attributes.username + " signup error " + error.code + ": " + error.message); 
        		res.location("/signup");
        		res.redirect("/signup");
        	}
        });
	});

	app.get("/login", function (req,res) {
		verifyLoginCookieAndSendPage(req, res, "login", "Login");
	});

	// returns private user info
	// saved for later -- might need it
	app.get("/login.api", function (req, res) {
		// Get private user info
		var q = new Parse.Query(Parse.User).equalTo("username", req.cookies.get("username"));
		q.first({
			success: function(result) {
				res.json({
					username: result.get("username"),
					email: result.get("email"),
					major: result.get("major"),
					emailVerified: result.get("emailVerified")
				});
				console.log("sent /login.api result for user " + result.get("username"));
			},
			error: function(error) {
				res.json({
					error: "username not found or not logged in"
				});
				console.log("error processing /login.api request for user " 
					+ req.cookies.get("username"));
			}
		});
	});

	var crypto = require('crypto');
	app.post("/login", function(req,res) {
		Parse.User.logIn(req.body.username, req.body.password, {
			success: function(user) {
				console.log("User " + user.attributes.username + " logged in");
				var uniqueKey = crypto.randomBytes(64).toString('base64');
				var date = new Date();
				date.setFullYear(date.getFullYear() + 3); // username expires in 3 years
				res.cookies.set("username", user.attributes.username, { expires: date, overwrite: true });
				date = new Date();
				date.setMonth(date.getMonth() + 3); // login expires in 90 days
				res.cookies.set("uniqueKey", uniqueKey, { signed: true, expires: date, overwrite: true });		
				user.set("uniqueKey", uniqueKey);
				res.cookies.set("sessionToken", user._sessionToken);
				user.save(null, {
					success: function(user) {
						console.log("Set login cookie on Parse for " + user.attributes.username);
						res.location("/");
						res.redirect("/");
					},
					error: function(user, err) {
						console.log("Couldn't save uniqueKey to Parse user " + user.attributes.username);
						res.location("/");
						res.redirect("/");
					}
				});
			},
			error: function(user, error) {
				console.log("User " + user.attributes.username + " login error " 
					+ error.code + ": " + error.message); 
				res.location("/signup");
        		res.redirect("/signup");
			}
		});
	});
};
