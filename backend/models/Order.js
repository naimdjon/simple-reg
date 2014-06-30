
Order=mongoose.model('Order',
    new Schema({
        name: { type: String, required: true, trim: true }
       ,mobile: {type: String, required: true, trim: true }
       ,licencePlate: {type: String, required: true, trim: true }
       ,comments: {type: String, required: false, trim: true }
       ,orderDate:{type:String}
    })
);
