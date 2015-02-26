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
      dialogTemplate: Template.bsModalPrompt,

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
    
    // Make sure to clean up.
    // Markup could remain if an error ocurred in a callback when processing
    // or hiding.
    $('.bs-modal-prompt').remove();

    var dialogData = _.extend({
      title: options.title,
      content: options.content,
      btnDismissText: options.btnDismissText,
      btnOkText: options.btnOkText 
    }, options.templateData);
    var dialog = Blaze.renderWithData(options.dialogTemplate, dialogData, $('body').get(0));

    var modal = $(dialog.firstNode()).find('.modal');

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
      if (callback) {
        callback(data ? data : true);
      }
    }

    if (options.template) {
      // Render the given template with the specified data and insert it 
      // to the modal-body directly.
      Blaze.renderWithData(
        options.template, 
        options.templateData,
        modal.find('.modal-body').get(0)
      );
    }
    
    if (options.formSchema) {
      // Render the form using the autoform quickForm template. 
      Blaze.renderWithData(
        Template.quickForm,
        {schema: options.formSchema, id: 'bootstrapModalPromptForm'},
        modal.find('.modal-body').get(0)
      );

      // Handle form submit.
      // Note the important second parameter true for replacing hooks.
      AutoForm.addHooks('bootstrapModalPromptForm', {
        onSubmit: function (insertDoc, updateDoc, currentDoc) {
          onConfirm(insertDoc);
          return false;
        }
      }, true);
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

      // Remove dialog from dom.
      Blaze.remove(dialog);
    });

    if (options.beforeShow) {
      options.beforeShow(options, modal.get(0));
    }

    // if btnDismissText is falsey, remove it
    if (!options.btnDismissText) {
      modal.find('.modal-btn-dismiss').remove();
    }
    else {
      modal.find('.modal-btn-dismiss').off().click(function() {
        if (options.beforeHide) {
          options.beforeHide(options, modal.get(0));
        }

        modal.modal('hide');
        if (callback)
          callback(false);

        return false;
      });
    }

    // if btnOkText is falsey, remove it
    if (!options.btnOkText) {
      modal.find('.modal-btn-save').remove();
    }
    else {
      modal.find('.modal-btn-confirm').off().click(function() {
        if (options.formSchema) {
          modal.find('form').submit();
        }
        else {
          onConfirm();
        }

        return false;
      });
    }

    modal.modal('show');
  };

  // Dismisses current modal if open
  exports.hide = function() {
    var modal = $('.bs-modal-prompt .modal');
    modal.modal('hide');
    $('.bs-modal-prompt').remove();
  }

  return exports;
}();
