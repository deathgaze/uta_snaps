$(function(){
    var validatedPassword = false;
    var validatedUsername = false;
    var validatedEmail = false;
    var validatedMajor = false;
   function validateUsernameInput() {
        if ($("#usernameInput").val().length <= 4) {
            $("#usernameErrorLabel").show();
            validatedUsername = false;
        } else {
            $("#usernameErrorLabel").hide();
            validatedUsername = true;
        }
    }
    $("#usernameInput").keyup(validateUsernameInput);
    $("#usernameInput").change(validateUsernameInput);

    // found here: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function testEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

    function validateEmailInput() {
        if (testEmail($("#emailInput").val())) {
            $("#emailErrorLabel").hide();
            validatedEmail = true;
        } else {
            $("#emailErrorLabel").show();
            validatedEmail = false;
        }
    }
    $("#emailInput").keyup(validateEmailInput);
    $("#emailInput").change(validateEmailInput);

    function validatePasswordInput() {
        if ($("#passwordInput").val().length >= 6) {
            $("#passwordErrorLabel").hide();
        } else {
            $("#passwordErrorLabel").show();
        }
    }
    $("#passwordInput").keyup(validatePasswordInput);
    $("#passwordInput").change(validatePasswordInput);

    function validatePasswordVerificationInput() {
        if ($("#verifyPasswordInput").val() == $("#passwordInput").val() &&
            $("#passwordInput").val().length >= 6) {
            $("#verifyPasswordErrorLabel").hide();
            validatedPassword = true;
        } else {
            $("#verifyPasswordErrorLabel").show();
            validatedPassword = false;
        }
    }
    $("#verifyPasswordInput").keyup(validatePasswordVerificationInput);
    $("#verifyPasswordInput").change(validatePasswordVerificationInput);

    function validateMajorInput() {
        if ($("#majorInput").val().length < 3) {
            $("#majorErrorLabel").show();
            validatedMajor = false;
        } else {
            $("#majorErrorLabel").hide();
            validatedMajor = true;
        }
    }
    $("#majorInput").keyup(validateMajorInput);
    $("#majorInput").change(validateMajorInput);
    function areInputsValid() {
        if (validatedUsername &&
             validatedEmail &&
             validatedPassword &&
             validatedMajor) {
            $("#submitBtn").prop("disabled", false);
        }
    };
    $(":input").keyup(areInputsValid);
    $(":input").change(areInputsValid);

});
