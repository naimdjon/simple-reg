exports.submitOrder = function (request, response) {
    console.dir("----   submitOrder -----");
    console.dir(request.body);
    console.log("name:"+request.body.name);
    console.log("mobile:"+request.body.mobile);
    console.log("nomer:"+request.body.licencePlate);
    console.log("orderDate:"+request.body.orderDate);
    //var orderedDate = moment(request.body.orderDate, 'YYYYMMDD');
   var order = new Order;
    order.name = request.body.name;
    order.licencePlate = request.body.licencePlate;
    order.mobile = request.body.mobile;
    order.orderDate =request.body.orderDate;
    console.log('LLO:'+order.orderDate);
    order.save(function (err, order, numberAffected) {
        if (err) {
            console.log("error:::::::"+err);
            response.jsonp(400,{error:"missing fields"});
            return;
        }
        console.log("saved:")
        response.jsonp(200,{result:"ok"});
    });

}

exports.all = function (request, response) {
    var fromDate = request.params.fromDate;
    Order.find({orderDate: new RegExp(fromDate,'i')}, function (err, orders) {
        var orderMap = {};
        orders.forEach(function(order) {
            if(orderMap[order.orderDate] == undefined) {
                orderMap[order.orderDate]=0;
            }
            orderMap[order.orderDate]++;
        })
        response.send(orderMap);
    });
};

exports.adminAll = function (request, response) {
    var fromDate1 = moment().format('YYYYMM');
    var fromDate2 = moment().month(moment().month()+1).format('YYYYMM');
    var orderMap = {};
    Order.find({$or:[{orderDate: new RegExp(fromDate1,'i')},{orderDate: new RegExp(fromDate2,'i')}]}, function (err, orders) {
        /*orders.forEach(function(order) {
            if(orderMap[order.orderDate] == undefined) {
                orderMap[order.orderDate]=[];
            }
            orderMap[order.orderDate].push(order);
        })*/
        //response.send(orderMap);
        response.render('admin_list_orders',{orders: orders});
    });
};

function toDate(momentDateStr) {
    var momentDate=moment(momentDateStr, 'YYYYMMDD');
    return new Date(momentDate.year(),momentDate.month(),momentDate.day());
}