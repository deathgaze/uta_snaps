$(function(){

    initialize();

    function initialize(){
        $("#signupBtn").click(signupBtnClick);
    }

    function signupBtnClick(){
        console.log("signupBtn Clicked");

        var username = $("#username");
        var email = $("#email");
        var password = $("#password");
        var vpassword = $("#vpassword");
        var major = $("#major");

        if(username.val() == "" ||
            email.val() =="" ||
            password.val() == "" ||
            password.val() != vpassword.val() ||
            major.val() == ""){

            alert("please fill out everything");

            return;
        }

        var user = new Parse.User();
        user.set("username", username.val());
        user.set("password", password.val());
        user.set("email", email.val());
        user.set("major", major.val());

        user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.

                alert("sign up successfully, check your email");

                //Clear fields
                username.val("");
                password.val("");
                vpassword.val("");
                email.val("");
                major.val("");
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });

    }
});