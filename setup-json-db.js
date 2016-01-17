var fs = require('fs'),
    path = require('path'),
    dbFilePath = path.join(__dirname, '/server/db.json'),
    dbContent = {
      users: [
        {
          id: 1,
          name: 'Joe Reactive',
          email: 'Joe.Reactive@rx.js',
          password: 'observable'
        }
      ]
    };

fs.exists(dbFilePath, function(exists) {
  if (! exists) {
    fs.writeFile(dbFilePath, JSON.stringify(dbContent), {encoding: 'utf-8'});
  }
});
