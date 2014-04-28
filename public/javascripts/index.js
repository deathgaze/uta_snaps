/**
 * New node file
 */

$(function(){

    var currentPage = 1;
    var numSnapsPerPage = 5;
    
    initialize();

    //Testing
    initializeGrids();

    function initialize(){
        retrieveImagesFromParse();
    }

    function retrieveImagesFromParse(){
        console.log("retrieving images");
        var Snap = Parse.Object.extend("Snap");
        var query = new Parse.Query(Snap);

        console.log("numSnapsPerPage: "+numSnapsPerPage);
        query.descending("numCookies");
        query.limit(numSnapsPerPage);

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

    function initializeGrids(){
        console.log("initializing grids");
        var $snapsGridContainer = $("#snapsGridContainer");
        $snapsGridContainer.isotope({
             itemSelector: '.snapsItem',
             layoutMode: 'fitRows'
        });
    }

});

