/**
 * New node file
 */
Parse.initialize("wJgTTR7HF7a0uUlc5IqyZVwL0IbCfk6WD9QRNdFf","govCyUnlBTYzWW6PO6zhbAVOtwtdFS6r6HJ4e5u0");
//Snaps BS Modal Creator
function SnapsBSModal(){

    var modalWrapper;
    var modalDialog; 
    var modalContent;
    var modalHeader;
    var modalBody; 
    var modalFooter;

    privateInitializer();

    this.getModal = function(){
        return modalWrapper;
    }

    this.setModalHeader = function($modalHeader){
       modalHeader.empty().append($modalHeader);
       return this;
    }

    this.appendToModalHeader = function($e){
        modalHeader.append($e);
        return this;
    }

    this.getModalBody = function(){
        return modalBody;
    }
    
    this.setModalBody = function($modalBody){
        modalBody.empty().append($modalBody);
        return this;
    }

    this.appendToModalBody = function($e){
        modalBody.append($e);
        return this;
    }

    this.getModalFooter = function(){
        return modalFooter;
    }

    this.setModalFooter = function($modalFooter){
        modalFooter.empty().append($modalFooter);
        return this;
    }

    this.appendToModalFooter = function($e){
        modalFooter.append($e);
        return this;
    }

    function privateInitializer(){
        
        modalWrapper = $('<div>').addClass('modal').attr('role', 'dialog');
        modalWrapper.attr('id', 'snapPopUpModal')
        modalDialog = $('<div>').addClass('modal-dialog');
        modalContent = $('<div>').addClass('modal-content');
        modalHeader = $('<div>').addClass('modal-header');
        modalBody = $('<div>').addClass('modal-body');
        modalFooter = $('<div>').addClass('modal-footer');

        modalContent.append(modalHeader).append(modalBody).append(modalFooter);
        modalDialog.append(modalContent);
        modalWrapper.append(modalDialog);
    }
}

//Singleton create a new snapsBSModal object to use with all the files
var snapsBSModal = new SnapsBSModal();

    //function snapElementClicked(snapObject,elementClicked){
    function snapElementClicked(snapObject){

        var title = snapObject['title'] || snapObject.get('title');
        var description = snapObject['description'] || snapObject.get('description');
        var imgUrl = snapObject['imgUrl'] || snapObject.get("imageFile").url();
        var publishedBy = snapObject['publishedBy'] || snapObject.get('publisherUsername');

        var cookies = 0;

        //if 0 will cause the if conditional to fail
        if(snapObject['numCookies'] == 0 || snapObject['numCookies']){
            cookies = snapObject['numCookies'];
        }else if(snapObject.get('numCookies')){
            cookies = snapObject.get('numCookies');
        }

        var closeBtn = $('<button>').attr('type','button').addClass('close').attr('data-dismiss', 'modal').text('Close');
        var modalTitle= $('<h4>').addClass('modal-title').text(title);

        snapsBSModal.setModalHeader(closeBtn)
        .appendToModalHeader(modalTitle);

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

        favoriteBtn.click(function(){
            favoriteBtnClicked(snapObject, 
                snapsBSModal.getModalBody(), 
                giveCookieBtn, 
                minusCookieBtn,
                favoriteBtn);
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

    function favoriteBtnClicked(parseObject, snapsBSModalBody, giveCookieBtn, minusCookieBtn,
        favoriteBtn){
        
        giveCookieBtn.prop('disabled', true);
        minusCookieBtn.prop('disabled',true);
        favoriteBtn.prop('disabled', true);

        if(snapsBSModalBody.children().length == 5){
            snapsBSModalBody.children()[4].remove();
        }

        var objectId = parseObject.id;

        $.ajax({
            url: '/favoritesnap',
            type: 'POST',
            data: {'objectId':objectId},
            success: function(data, textStatus, jqXHR){
                if(data.success){
                    var resultText = 'added snap to favorite!';
                    snapsBSModalBody.append($('<p>').addClass('text-success').text(resultText));
                }else{
                    if(data.error){
                        snapsBSModalBody.append($('<p>').addClass('text-danger').text(data.error));
                    }else{
                        var errorText = 'error favoriting cookie';
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

