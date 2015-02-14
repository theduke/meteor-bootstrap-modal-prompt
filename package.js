Package.describe({
  summary: "Show prompts in a bootstrap modal.",
  version: "0.0.1"
});

Package.onUse(function (api) {
  var both = ['client', 'server'];

  api.use('underscore', 'client');
  api.use('templating', 'client');

  api.export('BootstrapModalPrompt', 'client');

  // Common client and server files.
  api.addFiles([
   
  ], both);

  // Server only files.
  api.addFiles([
  ], 'server'); 

  // Templates.
  api.addFiles([
    'prompt.js'
  ], 'client');

  // Client only files.
  api.addFiles([
  ], 'client');
});
