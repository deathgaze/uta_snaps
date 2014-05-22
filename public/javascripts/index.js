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
        //console.log("title: "+snapObject.get("title"));
        //console.log(snapObject);
        //console.log(snapObject.get("numCookies"));

        console.log(snapObject.get('imageFile'));
        var title = snapObject.get('title');
        var description = snapObject.get('description');
        var imgUrl = snapObject.get("imageFile").url();
        var publishedBy = snapObject.get('publisherUsername');

        var closeBtn = $('<button>').attr('type','button').addClass('close').attr('data-dismiss', 'modal').text('Close');
        var title= $('<h4>').addClass('modal-title').text(title);

        snapsBSModal.setModalHeader(closeBtn)
        .appendToModalHeader(title);

        var img = $('<img>').attr('src', imgUrl);
        snapsBSModal.setModalBody(img)

        var paragraph = $('<p>').text(description);
        snapsBSModal.appendToModalBody(paragraph);

        var publishedBy = $('<p>').text('Published by: '+publishedBy);
        snapsBSModal.appendToModalBody(publishedBy);

        var giveCookieBtn = $('<button>').addClass('btn btn-primary').text('Give Cookie');
        var minusCookieBtn = $('<button>').addClass('btn btn-primary').text('Minus Cookie');
        var favorite = $('<button>').addClass('btn btn-primary').text('Favorite');

        snapsBSModal.setModalFooter(giveCookieBtn).appendToModalFooter(minusCookieBtn)
        .appendToModalFooter(favorite);       

        snapsBSModal.getModal().modal('toggle');
    }

    function giveCookieBtnClicked(parseObject){

    }

    function minusCookieBtnClicked(parseObject){

    }

    function favoriteBtnClicked(){
        
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
