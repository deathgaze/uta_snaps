/**
 * New node file
 */

$(function(){
    retrieveImagesFromParse();
});

function retrieveImagesFromParse(){
    console.log("retrieving images");
    var Snap = Parse.Object.extend("Snap");
    var query = new Parse.Query(Snap);
    query.find({
        success: function(results){
            console.log("retrieval success");
            populatePageWithAfterImagesRetrieve(results);
        },
        error: function(err){
            console.log("err: "+ err.message);
        }
    });
}

function populatePageWithAfterImagesRetrieve(results){
    console.log("numResults: "+results.length);
    for(var i = 0; i < results.length; i++){
        var snapObject = results[i];
        var snapPhotoUrl = snapObject.get("imageFile").url();
        console.log("snapPhotoUrl: "+snapPhotoUrl);
        
        //TODO create grids for index page
    }
}