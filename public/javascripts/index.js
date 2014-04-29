/**
 * New node file
 */

$(function(){

    var currentPage=0;
    var numSnapsPerPage=5;
    var paginationEnd=false;
    
    initialize();

    function initialize(){
        retrieveImagesFromParse();

        $("#backBtn").click(backBtnClicked);
        $("#nextBtn").click(nextBtnClicked);
    }

    function retrieveImagesFromParse(){
        console.log("retrieving images");
        var Snap = Parse.Object.extend("Snap");
        var query = new Parse.Query(Snap);

        console.log("numSnapsPerPage: "+numSnapsPerPage);
        query.descending("numCookies");
        query.limit(numSnapsPerPage);

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
        var snapsGridContainer = $("#snapsGridContainer");

        //Clear the container
        snapsGridContainer.empty();

        for(var i = 0; i < results.length; i++){
            var snapObject = results[i];
            var snapPhotoUrl = snapObject.get("imageFile").url();
            
            var snapItem = $("<div>").addClass("snapsItem");
            snapItem.append($("<img>").attr("src", snapPhotoUrl));
            snapsGridContainer.append(snapItem);
            //snapsGridContainer.isotope('appended', snapItem);
        }


        var $snapsGridContainer = snapsGridContainer.imagesLoaded(function(){
                console.log("all images loaded");
                 $snapsGridContainer.isotope({
                     itemSelector: '.snapsItem'
                });
        });
    }

    function initializeGrids(snapsGridContainer){
        console.log("initializing grids");
        var $snapsGridContainer = snapsGridContainer.imagesLoaded(function(){
                console.log("all images loaded");
                 $snapsGridContainer.isotope({
                     itemSelector: '.snapsItem'
                });
            });
    }

    function backBtnClicked(){
        console.log("back btn clicked");
        if (currentPage > 0){
            currentPage--;
            retrieveImagesFromParse();
        }
    }

    function nextBtnClicked(){
        console.log("next btn clicked");
        if(!paginationEnd){
            currentPage++;
            retrieveImagesFromParse();
        }
    }

});

