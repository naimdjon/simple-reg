User=mongoose.model('User',
    new Schema({
        _id:String,
        email:String,
        name:String,
        username:String,
        password:Number
    })
)
