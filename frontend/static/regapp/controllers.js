var controllers = angular.module('regapp.controllers', []);


controllers.controller("MonthViewCtrl", function ($scope,monthViewService,$http,$modal) {
    moment.lang('nb');
    var resourceId=window.resourceId,email=window.userEmail;
    this.start = moment({day: 1});
    this.currentMonth = this.start.format('MMMM / YYYY');
    this.daysOfWeek = []
    this.months = []
    this.greenPeriods = []
    this.showWeekNumbers=true
    for (var i = 0; i < 12; i++)this.months.push(moment().month(i).format('MMMM'));
    for (var i = 0; i < 7; i++)this.daysOfWeek.push(moment().startOf('week').add('days', i).format('ddd'));
    this.calendarView = monthViewService.generateCalendarMonthView(this.start,resourceId);
    this.changeMonth = function (num) {
        var newStart=isNaN(num)?this.start.clone().month(num):this.start.clone().add('months',num);
        this.currentMonth = newStart.format('MMMM / YYYY');
        this.calendarView = monthViewService.generateCalendarMonthView(newStart,resourceId);
        this.start=newStart;
    }
    var monthView=this;
    $scope.newOrderForm={};
    this.selectBookingDate = function (d) {
        $scope.newOrderForm.orderDate=d;
        $scope.newOrderForm.orderDateMissing=false;
    };

    $scope.submitOrder = function () {
        if(!$scope.newOrderForm.orderDate) {
            $scope.newOrderForm.orderDateMissing=true;
            return;
        }
        console.dir($scope.newOrderForm);
        var fd = new FormData();
        fd.append("name",$scope.newOrderForm.name);
        fd.append("mobile",$scope.newOrderForm.mobile);
        fd.append("comments",$scope.newOrderForm.comments);
        fd.append("orderDate",$scope.newOrderForm.orderDate);
        $http.put("/orders/submitOrder", fd, {
            headers: {'Content-Type': undefined },
            transformRequest: fd
        }).success(function(data,status){
                if(data.ok) {
                    console.log("ok");
                }
            console.log('XXXXXX');
            console.dir(data);
        }).error(function(data, status) {
                //$scope.error="error:"+e;
                console.log("error!"+status);
            }
        );
    };

});

