$(function(){
    // found here: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function testEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

    function validateEmailInput() {
        if (testEmail($("#emailInput").val())) {
            $("#emailErrorLabel").hide();
            $("#emailSubmitBtn").prop("disabled", false);
        } else {
            $("#emailErrorLabel").show();
            $("#emailSubmitBtn").prop("disabled", true);
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
            $("#passwordSubmitBtn").prop("disabled", false);
        } else {
            $("#verifyPasswordErrorLabel").show();
            $("#passwordSubmitBtn").prop("disabled", true);
        }
    }
    $("#verifyPasswordInput").keyup(validatePasswordVerificationInput);
    $("#verifyPasswordInput").change(validatePasswordVerificationInput);

    function validateMajorInput(e) {
        console.log(e.target.value); 
        if ($("#majorInput").val().length < 3) {
            $("#majorErrorLabel").show();
            $("#majorSubmitBtn").prop("disabled", true);
        } else {
            $("#majorErrorLabel").hide();
            $("#majorSubmitBtn").prop("disabled", false);
        }
    }
    $("#majorInput").keyup(validateMajorInput);
    $("#majorInput").change(validateMajorInput);
});
