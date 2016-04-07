var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
  // EXPRESION REGULAR para las excepciones
  // Si termina en .css, .js o .json.
  // Si en la ruta viene assets/img o bower_components o elements
  var rexp = new RegExp(/\.css$|\.js$|\.json$|assets\/img|bower_components|elements/g);
  var result = req.path.match(rexp);
  if (result !== null) {
    // SI HAY RESULTADOS DE LAS EXCEPCIONES LO SERVIMOS
    console.log('serving ' + req.url);
    next();
  } else {
    // SI NO HAY EXCEPCIONES ENVIAMOS index.html
    res.sendFile('index.html', {root: './path/del/servidor'});
  }
});

app.use(express.static('./path/del/servidor/'));

app.listen(process.env.PORT || 4001);

console.log('Server: http://localhost:4001');
