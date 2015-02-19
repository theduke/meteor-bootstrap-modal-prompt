console.log('loading from packages dir');

BootstrapModalPrompt = function() {
  var exports = {};
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
  exports.prompt = function(options, callback) {
    options = _.extend({
      title: 'Confirmation',
      content: '',
      template: null,
      templateData: {},
      dialogTemplate: null,


      formSchema: null,

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
      modalWrap = createModal();
    }

    var modal = modalWrap.find('.modal');
    var dialog = $('.modal-dialog', modalWrap); 
    var body;

    if (options.dialogTemplate) {
      // reset the dialog if it exists as custom template will render it
      if (dialog.size()) {
        dialog.remove();
      }
    } else {
      // need to create a dialog if one isn't provided
      if (!dialog.size()) {
        dialog = createModalDialog(modal);  
      }
      
      dialog.find('.modal-title').html(options.title);
      // Reset body.
      body = dialog.find('.modal-body').html('');
    }

    

    // Function to be called when confirmed.
    // Defined up here so it can be used in AutoForm submit hook.
    function onConfirm(data) {
      if (options.onConfirm) {
        var flag = options.onConfirm(options, modal.get(0), data);
        if (flag === false) {
          return false;
        }
      }

      if (options.beforeHide) {
        options.beforeHide(options, modal.get(0), data);
      }

      modal.modal('hide');
      if (callback)
        callback(data ? data : true);
    }

    var content = options.content;
    if (options.dialogTemplate) {
      // render entire dialog template with the specified data and insert it
      // into modal directly
      Blaze.renderWithData(
        options.dialogTemplate,
        options.templateData,
        modal.get(0)
      );

      dialog = $('.modal-dialog');
    }
    else if (options.template) {
      // Render the given template with the specified data and insert it 
      // to the modal-body directly.
      Blaze.renderWithData(
        options.template, 
        options.templateData,
        body.get(0)
      );
    }
    else if (options.formSchema) {
      // Render the form using the autoform quickForm template. 
      Blaze.renderWithData(
        Template.quickForm,
        {schema: options.formSchema, id: 'bootstrapModalPromptForm'},
        body.get(0)
      );

      // Note the important second parameter true for replacing hooks.
      AutoForm.addHooks('bootstrapModalPromptForm', {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
          onConfirm(insertDoc);
          return false;
        }
      }, true);
    }
    else {
      modal.find('.modal-body').html(content);
    }

    modal.find('.modal-btn-dismiss').html(options.btnDismissText);
    modal.find('.modal-btn-save').html(options.btnOkText);

    // if btnDismissText is falsey, remove it
    if (!options.btnDismissText) {
      modal.find('.modal-btn-dismiss').remove();
    }

    modal.on('shown.bs.modal', function() {
      if (options.afterShow) {
        options.afterShow(options, modal.get(0));
      }
    });
    modal.on('hidden.bs.modal', function() {
      if (options.afterHide) {
        options.afterHide(options, modal.get(0));
      }
      // need to clean up custom dialog template if used
      if (options.dialogTemplate) {
        dialog.remove();
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
      if (callback)
        callback(false);

      return false;
    });

    

    modal.find('.modal-btn-confirm').off().click(function() {
      if (options.formSchema) {
        modal.find('form').submit();
      }
      else {
        onConfirm();
      }

      return false;
    });

    modal.modal('show');
  };

  // Dismisses current modal if open
  exports.dismiss = function(callback) {
    var modal = $('.modal', '.bs-prompt-modal');
    modal.modal('hide');
  }

  var createModal = function() {
    var tpl = '<div class="bs-prompt-modal">' +
                '<div class="modal fade"></div>' +
              '</div>';

    $('body').append(tpl);
    return $('.bs-prompt-modal');
  };

  var createModalDialog = function($modal) {
    var tpl = '<div class="modal-dialog"><div class="modal-content">' +
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
                '</div></div>';
    $modal.append(tpl);
    return $('.modal-dialog');          
  };

  return exports;
}();
