Schema = mongoose.Schema;
var dbURL="mongodb://testbruker:testpassord@ds053597.mongolab.com:53597/heroku_app26956465"
//var dbURL="mongodb://localhost/simple-reg"
var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } }
    console.log("connected to the DB");
    mongoose.connect(dbURL, options)
}
connect()
mongoose.connection.on('disconnected', function () {
    connect()
})
