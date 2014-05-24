$(function(){
   $('a.snapAnchor').click(function(e){
        e.preventDefault();
        var dataJson = JSON.parse($(this).attr('data-json'));

        //create a popup modal
        var snapObject = {};
        snapObject.title = dataJson.title;
        snapObject.description = dataJson.description;
        snapObject.imgUrl = dataJson.imageFile.url;
        snapObject.publishedBy = dataJson.publisherUsername;
        snapObject.numCookies = dataJson.numCookies;
        snapObject.id = dataJson.objectId;

        snapElementClicked(snapObject);
   });
});