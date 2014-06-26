exports.submitOrder = function (request, response) {
    var name = request.body.name;
    var licencePlate = request.body.licencePlate;
    var mobile = request.body.mobile;
    var orderDate = request.body.orderDate;
    var order = new Order;
    order.name = name;
    order.licencePlate = licencePlate;
    order.mobile = mobile;
    order.orderDate = orderDate;
    order.save(function (err, order, numberAffected) {
        if (err) {
            console.log("error:::::::"+err);
            response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
            response.end(JSON.stringify({"error": err}), 200);
            return;
        }
        response.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  });
        if (parseInt(numberAffected) != 1) {
            response.end(JSON.stringify({"error": "Could not insert the item:"+error+", " + numberAffected}), 500);
        }else{
            response.end(JSON.stringify({"ok":"item stored!"}, 200));
        }
    });

}