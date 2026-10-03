const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('static'));

const server = app.listen(port, function() {
  console.log('Server running at http://localhost:' + port);
});