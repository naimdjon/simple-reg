Schema = mongoose.Schema;
//var dbURL="mongodb://testbruker:testbruker@ds037698.mongolab.com:63178/heroku_app26734021"
var dbURL="mongodb://localhost/simple-reg"
var connect = function () {
    var options = { server: { socketOptions: { keepAlive: 1 } } }
    console.log("connected to the DB");
    mongoose.connect(dbURL, options)
}
connect()
mongoose.connection.on('disconnected', function () {
    connect()
})
