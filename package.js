Package.describe({
  name: 'theduke:bootstrap-modal-prompt',
  summary: "Show prompts in a bootstrap modal.",
  version: "0.1.0",
  git: "https://github.com/theduke/meteor-bootstrap-modal-prompt"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');

  api.use('underscore', 'client');
  api.use('templating', 'client');

  api.export('BootstrapModalPrompt', 'client');

  api.addFiles([
    'templates/bs_modal_prompt.html',
    'prompt.js'
  ], 'client');

});
