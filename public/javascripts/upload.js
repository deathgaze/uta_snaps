/**
 * New node file
 */
$(function(){
    //upload global vars
    var webcamBtn = $("#webcamBtn");
    var takeWebcamPicBtn = $("#takeWebcamPicBtn");
    var stopWebcamBtn = $("#stopWebcamBtn");
    var username = "";
    var base64ImgStr = "";
    
    initialize();
    
    function initialize(){
        $('#uploadBtn').click(uploadBtnClicked);
        
        takeWebcamPicBtn.hide();
        takeWebcamPicBtn.click(takeWebcamPicBtnClicked);
        
        stopWebcamBtn.hide();
        stopWebcamBtn.click(stopWebcamBtnClicked);
        
        webcamBtn.click(webcamPictureBtnClicked);
        
        var currentUser = new Object();
        $.get("/login.api").done(function(userInfo) {
          currentUser = userInfo;
        });

        if(typeof currentUser == "object") {
          console.log("user is logged in");
          username = currentUser.username;
        } else {
          console.log("user is not logged in");
          username = "anonymous";
        }
        $( document ).ajaxError(function() {   
          console.log( "Triggered ajaxError handler." );
        });
    }
    
    function uploadBtnClicked(){
        console.log("uploadBtn clicked");
        var title = $("#snapTitle").val();
        var description = $("#snapDescription").val();
        
        var fileUploadControl = $("#snapImage")[0];
        
        if (title == "" 
          || description == "" ) {
            
          alert("Please fill out all forms");
          return;
          
        }
        
        if(fileUploadControl.files.length > 0){
            var file = fileUploadControl.files[0];
            var name = file.name;
            var parseFile = new Parse.File(name, file);

            parseFile.save().then(function(){
                //file save successful 
               parseFileSaveCallBack(
                   description,parseFile,username, title);
                
            }, function(error){
                if(error)
                    alert("error: " + error.message);
            });  
        }else if(base64ImgStr !== ""){
            console.log(base64ImgStr);
            var parseFile = new Parse.File("myfile.jpg",{base64: base64ImgStr});
            
            parseFile.save().then(function(){
                //file save successful
                 parseFileSaveCallBack(
                   description,parseFile,username, title);
                
            }, function(error){
                if(error)
                    alert("error: "+error.message);
            });
        }
        else{
          alert("Please upload or take a photo.");  
        }
    }
    
    function parseFileSaveCallBack(description,parseFile,
                                    username, title){
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
    }
    function stopWebcamBtnClicked(){
        //$.scriptcam = null;
        console.log("stop web cam");
        $("#webcam").hide();
        webcamBtn.show();
        takeWebcamPicBtn.hide();
        stopWebcamBtn.hide();
        //takeWebcamPicBtn.show();
    }
    
    function takeWebcamPicBtnClicked(){
        var base64Str = $.scriptcam.getFrameAsBase64();
        $('#webcamImg').attr("src","data:image/png;base64,"+base64Str);
        base64ImgStr = base64Str;
        //Clear the file upload field
        $("#snapImage").val("");
    }
    
    function webcamPictureBtnClicked(){
        console.log("clicked webcam picture");
        $("#webcam").scriptcam({
            showMicrophoneErrors:false,
            onError:onError,
            cornerRadius:20,
            cornerColor:'e3e5e2',
            onWebcamReady:onWebcamReady,
            //uploadImage:'upload.gif',
            //onPictureAsBase64:base64_tofield_and_image 
        });
    }
    
    //Script Cam Functions
    function onWebcamReady(cameraNames,camera,microphoneNames,microphone,volume) {
        //hide webcam picture button and replace with take picture
        webcamBtn.hide();
        takeWebcamPicBtn.show();
        stopWebcamBtn.show();
    }
    
    function onError(errorId,errorMsg) {
        alert(errorMsg);
    }	
    
});
