'use strict';

var services = angular.module('regapp.services', []);


services.factory('bookingService', function ($http) {
    var bookings;
    var getBookingsForResource = function (from) {
        var promise = $http.get('/orders/all/'+from)
            .then(function (res) {
                bookings = res.data;
                return bookings;
            });
        return promise;
    };
    return {
        getBookingsForResource: getBookingsForResource
    };
});

function weekOfMonth(d){
    var firstDay=moment(d).date(1);
    return moment(d).isoWeek()-firstDay.isoWeek();
}

services.factory('monthViewService', function (bookingService) {
    function addOrderCountsAndMarkBusy(start, weeks) {
        bookingService.getBookingsForResource(start.format('YYYYMM')).then(function (data) {
                angular.forEach(data,function (count, dayOrder) {
                    var d=moment(dayOrder,'YYYYMMDD');
                    var calendarDay=weeks[weekOfMonth(d)].days[d.weekday()];
                    delete calendarDay.isAvailable;
                    if(moment().isAfter(d)) {
                        calendarDay.isPast=true;
                    }else if(count==3) {
                        calendarDay.isBusiest=true;
                    }else if(count==2) {
                        calendarDay.isBusier=true;
                    }else if(count==1) {
                        calendarDay.isBusy=true;
                    }
                    calendarDay.available=calendarDay.available-count;
            });
        });
    }

    function generateDates(start,weeks) {
        var end = start.clone().add('M', 1);
        var runnerDate = (start.clone()).isoWeekday(1);
        while (runnerDate.isBefore(end)) {
            var week = {week: runnerDate.week(), days: [], number: runnerDate.isoWeek()};
            for (var weekDay = 0; weekDay <= 6; weekDay++) {
                var chosenLabel=runnerDate.format('dddd, D.MMMM YYYY');
                var weekDayObj={
                    dateStr:chosenLabel
                    ,label: runnerDate.date()
                    ,month:runnerDate.month()
                    ,isCurrentMonth: (start.month() == runnerDate.month())
                    ,isPast: moment().isAfter(runnerDate)
                    ,available: 3
                    ,momentDate: runnerDate.clone()
                };
                if(!weekDayObj.isPast && weekDayObj.isCurrentMonth) {
                    weekDayObj.isAvailable=true;
                }
                week.days.push(weekDayObj);
                runnerDate.add('d', 1);
            }
            weeks.push(week);
        }
    }

    var generateCalendarMonthView = function (start) {
        var calendarView={weeks: []};
        generateDates(start,calendarView.weeks);
        addOrderCountsAndMarkBusy(start, calendarView.weeks);
        //markGreenPeriods(start, calendarView);
        return calendarView;
    };
    return{
        generateCalendarMonthView: generateCalendarMonthView //api
    }
});

