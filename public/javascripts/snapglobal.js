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

    this.setModalBody = function($modalBody){
        modalBody.empty().append($modalBody);
        return this;
    }

    this.appendToModalBody = function($e){
        modalBody.append($e);
        return this;
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

var snapsBSModal = new SnapsBSModal();
