/**
 * New node file
 */

$(function(){

    var currentPage=0;
    var numSnapsPerPage=10;
    var paginationEnd=false;

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
            snapItem.click(function(event){
                snapThumbnailClicked(snapObject,snapImg);
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
        
        //create a popup modal
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