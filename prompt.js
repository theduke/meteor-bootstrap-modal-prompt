BootstrapModalPrompt = {

  /*
   * Expected format of options:
   * {
   *   title: 'Modal Title',
   *   content: 'Text content for modal',
   *   template: 'templateWithContentName',
   *   templateData: {},
   *   btnDismissText: 'Close',
   *   btnOkText: 'OK',
   *   onShown: function() {} // callback function.
   * }
   */
  prompt: function(options, callback) {
    options = _.extend({
      title: 'Bootstrap Modal',
      content: '',
      template: null,
      templateData: {},
      btnDismissText: 'Close',
      btnOkText: 'OK',

      // Callback called before the modal is shown.
      // Arguments are the passed initial options, and the modal DOM node.
      beforeShow: function(options, node) {

      },
      // Called after the modal is shown and all transitions have been completed.
      // Arguments are the passed initial options, and the modal DOM node.
      afterShow: function(options, node) {

      },

      // Callback called before the modal is hidden.
      // Arguments are the passed initial options, and the modal DOM node.
      beforeHide: function(options, node) {

      },

      // Callback called after the modal has been hidden and all transitions have completed.
      // Arguments are the passed initial options, and the modal DOM node.
      afterHide: function(options, node) {

      },

      // Called when the users clicks on the confirm button.
      // If the function returns false, the confirm will be ABORTED.
      // Otherwise the modal will be closed and the regular callback is called with the result.
      // Arguments are the passed initial options, and the modal DOM node.
      onConfirm: function(options, node) {
        // return false; // Aborts closing of modal!
      }
    }, options);

    var modalWrap = $('.bs-prompt-modal');
    if (!modalWrap.size()) {
      modalWrap = this.createModal();
    }

    var modal = modalWrap.find('.modal');

    modal.find('.modal-title').html(options.title);

    var content = options.content;
    if (options.template) {
      // Render the given template with the specified data and insert it 
      // to the modal-body directly.
      Blaze.renderWithData(
        options.template, 
        options.templateData,
        modal.find('.modal-body').html('').get(0)
      );
    }
    else {
      modal.find('.modal-body').html(content);
    }

    modal.find('.modal-btn-dismiss').html(options.btnDismissText);
    modal.find('.modal-btn-save').html(options.btnOkText);

    modal.on('shown.bs.modal', function() {
      if (options.afterShow) {
        options.afterShow(options, modal.get(0));
      }
    });
    modal.on('hidden.bs.modal', function() {
      if (options.afterHide) {
        options.afterHide(options, modal.get(0));
      }
    });

    if (options.beforeShow) {
      options.beforeShow(options, modal.get(0));
    }

    modal.find('.modal-btn-dismiss').off().click(function(){
      if (options.beforeHide) {
        options.beforeHide(options, modal.get(0));
      }

      modal.modal('hide');
      callback(false);

      return false;
    });

    modal.find('.modal-btn-confirm').off().click(function() {
      if (options.onConfirm) {
        var flag = options.onConfirm(options, modal.get(0));
        if (flag === false) {
          return false;
        }
      }

      if (options.beforeHide) {
        options.beforeHide(options, modal.get(0));
      }

      modal.modal('hide');
      callback(true);

      return false;
    });

    modal.modal('show');
  },

  createModal: function() {
    var tpl = '<div class="bs-prompt-modal">' +
                '<div class="modal fade"><div class="modal-dialog"><div class="modal-content">' +
                  '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<h4 class="modal-title"></h4>' +
                  '</div>' +
                  '<div class="modal-body">' +

                  '</div>' +
                  '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default modal-btn-dismiss" >Close</button>' + 
                    '<button type="button" class="btn btn-primary modal-btn-confirm">OK</button>' +
                  '</div>' +

                '</div></div></div>' +
              '</div>';

    $('body').append(tpl);
    return $('.bs-prompt-modal');
  }
};
