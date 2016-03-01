var menubar = require('menubar')

var mb = menubar({
  'always-on-top': false
})

mb.on('ready', function ready () {
  console.log('app is ready')
});

mb.on('after-create-window', () => {
  mb.window.openDevTools();
});