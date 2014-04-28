/**
 * New node file
 */
$(function(){
    console.log("upload.js loaded");
    //upload global vars
    var username = "";
    
    initialize();
    
    function initialize(){
        $('#uploadBtn').click(uploadBtnClicked);
        //Get the username is the user is logged in
        //console.log("username: "+username);
        var currentUser = Parse.User.current();
        if(currentUser){
          console.log("user is logged in");
          username = currentUser.getUsername();
        }else{
          console.log("user is not logged in");
          username = "anonymous";
        }
    }
    
    function uploadBtnClicked(){
        console.log("uploadBtn clicked");
        var title = $("#snapTitle").val();
        var description = $("#snapDescription").val();
        
        var fileUploadControl = $("#snapImage")[0];
        
        if (fileUploadControl.files.length == 0 || title == "" 
          || description == "") {
          alert("Please fill out all forms and upload a picture");
          return;
        }
            
        var file = fileUploadControl.files[0];
        var name = file.name;
        console.log("file: "+file.name);
        var parseFile = new Parse.File(name, file);
        
        parseFile.save().then(function(){
            //save successful 
            var snap = new Parse.Object("Snap");
            snap.set("description", description);
            snap.set("imageFile", parseFile);
            snap.set("numCookies", 0);
            
            snap.set("publisherUsername", username);
            snap.set("title", title);
            
            snap.save();
            
            alert("upload successful");

            //clear fields
            $("#snapTitle").val("");
            $("#snapDescription").val("");
            $("#snapImage").val("");
            
        }, function(error){
            if(error)
                alert("error: "+error.message);
        }); 
        
    }
});