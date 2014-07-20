var controllers = angular.module('regapp.controllers', []);


controllers.controller("MonthViewCtrl", function ($scope,monthViewService,$http,$window) {
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
    this.calendarView = monthViewService.generateCalendarMonthView(this.start);
    this.changeMonth = function (num) {
        var newStart=isNaN(num)?this.start.clone().month(num):this.start.clone().add('months',num);
        this.currentMonth = newStart.format('MMMM / YYYY');
        this.calendarView = monthViewService.generateCalendarMonthView(newStart,resourceId);
        this.start=newStart;
    }
    var monthView=this;
    $scope.newOrderForm={};
    this.selectBookingDate = function (d) {
        if(d.isWeekend) {
            alert("Dessverre tar vi ikke imot bestillinger på lørdager og søndager. \n" +
                "Venngligst velg en annen dato!");
        }else {
            $scope.newOrderForm.orderDate=d;
            $scope.newOrderForm.orderDateMissing=false;
            $scope.newOrderForm.available= d.available;
        }
    };

    $scope.submitOrder = function () {
        //console.log('$scopte.newOrderForm.available:'+$scope.newOrderForm.available);
        if(!$scope.newOrderForm.orderDate) {
            $scope.newOrderForm.orderDateMissing=true;
            return;
        }

        var formdata={
             orderDate:$scope.newOrderForm.orderDate.momentDate.format('YYYYMMDD')
            ,name:$scope.newOrderForm.name
            ,mobile:$scope.newOrderForm.mobile
            ,comments:$scope.newOrderForm.comments
            ,licencePlate:$scope.newOrderForm.licencePlate
        };
        if($scope.newOrderForm.available<1) {
            alert("Siden vi er fullbokket vil du stå på venteliste!");
            formdata.isWaitingList=true;
        }
        $http({
            method:"POST"
            ,url:'/orders/submitOrder'
            ,data: $.param(formdata)
            , headers:{'Content-type':"application/x-www-form-urlencoded; charset=utf-8"}
        })
            .success(function(data){
                $scope.message=data;
                alert('Bestillingen er sendt!');
            }).error(function(data,status) {
                $scope.error=data;
                alert('Det skjedde en feil ved sending av bestillingen!');
            });
    };



});

