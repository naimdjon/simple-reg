exports.submitOrder = function (request, response) {
    console.dir("----   submitOrder -----");
    console.dir(request.body);
    console.log("name:"+request.body.name);
    console.log("mobile:"+request.body.mobile);
    console.log("nomer:"+request.body.licencePlate);
    console.log("orderDate:"+request.body.orderDate);
   var order = new Order;
    order.name = request.body.name;
    order.licencePlate = request.body.licencePlate;
    order.mobile = request.body.mobile;
    order.orderDate = request.body.orderDate;
    order.save(function (err, order, numberAffected) {
        if (err) {
            console.log("error:::::::"+err);
            response.jsonp(400,{error:"missing fields"});
            return;
        }
        response.jsonp(400,{result:"ok"});
    });

}