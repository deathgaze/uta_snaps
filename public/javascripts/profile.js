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

$(function(){

    var currentPage=0;
    var numSnapsPerPage=10;
    var paginationEnd=false;
    var username = $("#usernameLabel").text(); // This is set by the server

    var snapsGridContainer = $("#snapsGridContainer");
    var $snapsGridContainer;
    
    initialize();

    function initialize(){
        $snapsGridContainer = snapsGridContainer.imagesLoaded(function(){
                 $snapsGridContainer.isotope({
                     itemSelector: '.snapsItem'
                });
        });

        retrieveImagesFromParse();
        $("#backBtn").click(function(event){
            event.preventDefault();
            backBtnClicked();
        });
        $("#nextBtn").click(function(event){
            event.preventDefault();
            nextBtnClicked();
        });
    }

    function retrieveImagesFromParse(){
        console.log("retrieving images");
        var Snap = Parse.Object.extend("Snap");
        var query = new Parse.Query(Snap);

        console.log("numSnapsPerPage: "+numSnapsPerPage);
        query.ascending("updatedAt");
        query.limit(numSnapsPerPage);
        query.equalTo("publisherUsername", username);

        if(currentPage>0)
            query.skip(currentPage*numSnapsPerPage);

        query.find({
            success: function(results){
                console.log("retrieval success");

                if(results.length < numSnapsPerPage)
                    paginationEnd=true;

                populatePageWithAfterImagesRetrieve(results);
            },
            error: function(err){
                console.log("err: "+ err.message);
            }
        });
    }

    function populatePageWithAfterImagesRetrieve(results){
        console.log("numResults: "+results.length);

        //Clear the container
        //snapsGridContainer.empty();
        $snapsGridContainer.isotope('remove', snapsGridContainer.children());

        for(var i = 0; i < results.length; i++){
            var snapObject = results[i];
            var snapPhotoUrl = snapObject.get("imageFile").url();
            
            var snapItem = $("<div>").addClass("snapsItem");
            var snapImg = $("<img>").attr("src", snapPhotoUrl);
            snapItem.append(snapImg);
            
            //Add click event handler to snapItem
            snapItem.click({so: snapObject, si: snapImg}, function(e){
                snapThumbnailClicked(e.data.so,e.data.si);
            });

            snapsGridContainer.append(snapItem);
            $snapsGridContainer.isotope('appended', snapItem);
        }
        $snapsGridContainer.isotope("layout");
    }

    function snapThumbnailClicked(snapObject,snapImg){
        //console.log("title: "+snapObject.get("title"));
        console.log("title: "+snapObject.get("title"));
        console.log(snapObject);
        console.log(snapObject.get("numCookies"));

        console.log($);

        var btn = $('<button>').attr('type','button').addClass('close').attr('data-dismiss', 'modal').text('Close');
        var e= $('<h4>').addClass('modal-title').text('Modal Title');
        snapsBSModal.setModalHeader(btn).appendToModalHeader(e).getModal().modal('toggle');

    }

    function backBtnClicked(){
        console.log("back btn clicked");
        console.log("currentPage: "+currentPage);
        if (currentPage > 0){
            currentPage--;
            retrieveImagesFromParse();
        }
        paginationEnd=false;
    }

    function nextBtnClicked(event){
        console.log("next btn clicked");
        console.log("currentPage: "+currentPage);
        if(!paginationEnd){
            currentPage++;
            retrieveImagesFromParse();
        }
    }

});

