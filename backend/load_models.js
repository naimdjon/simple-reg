mongoose=require('mongoose')
require('./db')
var fs = require('fs')
var models_path = __dirname+'/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file); //console.log("loading model "+(models_path + '/' + file))
})
