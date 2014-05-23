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
        var cookies = snapObject.get('numCookies');

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

        var numCookies = $('<p>').text('Cookies: '+cookies);
        snapsBSModal.appendToModalBody(numCookies);

        var giveCookieBtn = $('<button>').addClass('btn btn-primary').text('Give Cookie');
        var minusCookieBtn = $('<button>').addClass('btn btn-primary').text('Minus Cookie');
        var favoriteBtn = $('<button>').addClass('btn btn-primary').text('Favorite');

        snapsBSModal.setModalFooter(giveCookieBtn).appendToModalFooter(minusCookieBtn)
        .appendToModalFooter(favoriteBtn);

        giveCookieBtn.click(function(){
            giveOrMinusCookieBtnClicked(snapObject, 
                snapsBSModal.getModalBody(),
                giveCookieBtn,
                minusCookieBtn,
                favoriteBtn, true);
        }); 

        minusCookieBtn.click(function(){
            giveOrMinusCookieBtnClicked(snapObject, 
                snapsBSModal.getModalBody(),
                giveCookieBtn,
                minusCookieBtn,
                favoriteBtn, false);
        });    

        snapsBSModal.getModal().modal('toggle');
    }

    function giveOrMinusCookieBtnClicked(parseObject, snapsBSModalBody, giveCookieBtn, minusCookieBtn,
        favoriteBtn, giveCookie){

        giveCookieBtn.prop('disabled', true);
        minusCookieBtn.prop('disabled',true);
        favoriteBtn.prop('disabled', true);

        //send cookie to route , check if cookie matches a username and
        //if it does set publisherUsername to the username else set it as anonymous
        console.log('num Children: ', snapsBSModalBody.children().length);
        console.log(snapsBSModalBody.children());

        if(snapsBSModalBody.children().length == 5){
            snapsBSModalBody.children()[4].remove();
        }

        var objectId = parseObject.id;

        var type = 'give';

        if(!giveCookie)
            type = 'minus';

        $.ajax({
            url: '/plusorminuscookie',
            type: 'POST',
            data: {'objectId':objectId, 'type':type},
            success: function(data, textStatus, jqXHR){
                if(data.success){
                     var numCookies = data.numCookies;
                     snapsBSModalBody.children()[3].remove();
                     snapsBSModal.appendToModalBody($('<p>').text('Cookies: '+numCookies));

                     var resultText = 'You gave a cookie!';

                     if(!giveCookie)
                        resultText = 'You took a cookie!';

                     snapsBSModalBody.append($('<p>').addClass('text-success').text(resultText));
                }else{
                    if(data.error)
                        snapsBSModalBody.append($('<p>').addClass('text-danger').text(data.error));
                    else{
                        var errorText = 'error giving cookie';

                        if(!giveCookie)
                            errorText = 'error taking cookie.';

                        snapsBSModalBody.append($('<p>').addClass('text-danger').text(errorText));
                    }
                }   
            },
            error: function(jqXHR, textStatus, errorThrown){
                snapsBSModalBody.append($('<p>').addClass('text-danger').text(errorThrown));
            }
        }).always(function(){
            giveCookieBtn.prop('disabled', false);
            minusCookieBtn.prop('disabled',false);
            favoriteBtn.prop('disabled', false);
        });
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
