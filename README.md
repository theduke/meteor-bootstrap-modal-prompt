# bootstrap-modal-prompt

This [Atmosphere package](https://atmospherejs.com/theduke/bootstrap-modal-prompt) for [Meteor](http://meteor.com) makes it really easy to show a confirm dialog with custom content to the user, and get the result. You can also use a custom template for the content, and even specify a SimpleSchema to generate a form with AutoForm and get the form data in a callback.

Version: 0.0.3

## Installation

```bash
meteor add theduke:bootstrap-modal-prompt
```

## Requirements

Twitter Bootstrap 3 needs to be present. 
You can manually include it in your project, or use one of the many Bootstrap packages, like https://atmospherejs.com/twbs/bootstrap.

## Usage

### Prompt

* Show a simple dialog with text content:

```javascript
BootstrapModalPrompt.prompt({
    title: "Confirm something",
    content: "Do you really want to confirm whatever?"
}, function(result) {
  if (result) {
    // User confirmed it, so go do something.
  }
  else {
    // User did not confirm, do nothing.
  }
});
```

* Use a custom template and, customize the button text: 

```javascript
BootstrapModalPrompt.prompt({
    title: "Confirm something",
    template: Template.myCustomTemplate,
    templateData: {
      customKey: 333
    },
    btnDismissText: 'Forget it!',
    btnOkText: 'Alright, let\'s do it!'
}, function(result) {
  if (result) {
    // User confirmed it, so go do something.
  }
  else {
    // User did not confirm, do nothing.
  }
});
```

* Render an AutoForm with a SimpleSchema, and receive the data in the callback.

```javascript
var MyFancySchema = new SimpleSchema({
  comments: {
    type: String,
    min: 20
  }
});

BootstrapModalPrompt.prompt({
    title: "Confirm something",
    formSchema: MyFancySchema,
}, function(data) {
  if (data) {
    // User confirmed it, so go do something.
    console.log(data.comments);
  }
  else {
    // User did not confirm, do nothing.
  }
});
```

Hint: if you want to customize the form with {{#autoForm}} or do other javascript stuff,
use a custom template as shown above!

* Use a custom dialog template for ultimate flexibility.

```html
<template name="RequestDemoModal">
  <div class="bs-modal-prompt">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
          <h3 class="modal-title" id="myModalLabel">We want to hear you out!</h3>
        </div>
        {{#autoForm id='requestDemo' schema=requestDemoSchema type="method" meteormethod="requestDemo" resetOnSuccess=false}}
        <div class="modal-body">
          <p>Provide us some info to get in touch.</p>
          {{> afQuickField name="name"}}
          {{> afQuickField name="email"}}
          {{> afQuickField name="phone"}}
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary btn-block">Send</button>
        </div>
        {{/autoForm}}
      </div>
    </div>
  </div>
</template>
```

```javascript
Template.site.events({
  'click .js-request-demo': function () {
    BootstrapModalPrompt.prompt({
      dialogTemplate: Template.RequestDemoModal
    });
  }
});

Template.RequestDemoModal.helpers({
  requestDemoSchema: function () {
    return Schema.RequestDemo;
  }
});

AutoForm.hooks({
  requestDemo: {
    onSuccess: function(operation, result, template) {
      BootstrapModalPrompt.hide();
    }
  }
});
```

### Hide

* Hide the current modal

```javascript
BootstrapModalPrompt.hide();
```

## API & Options

BootstrapModalPrompt.prompt(options, callback);

The following options are supported:

Option | Description
------ | -----------
title | The modal title
content | A string that will be used as the modal body content
template | A Meteor Template instance that should be rendered as the body content (supersedes "content")
templateData | an object with data that will be available to the custom template
dialogTemplate | A Meteor Template instance that should be rendered as the modal dialog (supersedes 'content' and 'template') (works with templateData)
btnDismissText | Text of the dismiss button - set to null to hide
btnOkText | Text of the confirm button - set to null to hide
beforeShow | Callback that will be called before the modal is displayed. Receives the options and the modal DOM node as arguments
afterShow | Callback that will be called once the modal is displayed and all transitions are complete. Receives the options and the modal DOM node as arguments
beforeHide | Callback that will be called before the modal is hidden. Receives the options and the modal DOM node as arguments
afterHide | Callback that will be called once the modal is hidden and all transitions are completed. Receives the options and the modal DOM node as arguments
onConfirm | Callback that is called when the user clicks the confirm button. Receives the options and the modal DOM node as arguments. *If this function returns false, the confirmation is aborted and the modal will not be hidden.*

## License

This project is under the MIT License.

## Authors

* Christoph Herzog - chris@theduke.at
