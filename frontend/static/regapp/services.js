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
                    var d = moment(dayOrder,'YYYYMMDD');
                    var nextMomentDay = d.clone();
                    nextMomentDay=nextMomentDay.add('days', 1);
                    var calendarDay = weeks[weekOfMonth(d)].days[d.weekday()];
                    calendarDay.orderCount=count;
                    var nextCalendarDay = weeks[weekOfMonth(nextMomentDay)].days[nextMomentDay.weekday()];
                    var shouldMarkNextDay=nextCalendarDay.momentDate.isAfter(calendarDay.momentDate) && !nextCalendarDay.isWeekend;

                    nextCalendarDay.ordersFromPrevious=count;
                    delete calendarDay.isAvailable;
                    delete nextCalendarDay.isAvailable;
                    calendarDay.isBusier=false;
                    calendarDay.isBusy=false;
                    calendarDay.isBusiest=false;
                    if(moment().isAfter(d)) {
                        calendarDay.isPast=true;
                        if(moment().isAfter(nextMomentDay)) {
                            nextCalendarDay.isPast=true;
                        }
                    }else if(count>2) {
                        calendarDay.isBusiest=true;
                        if(shouldMarkNextDay) {
                            nextCalendarDay.isBusiest=true;
                        }
                    }else if(count==2) {
                        calendarDay.isBusier=true;
                        if(shouldMarkNextDay) {
                            nextCalendarDay.isBusier=true;
                        }
                    }else if(count==1) {
                        console.log("d:"+d.format());
                        console.log("n:"+nextMomentDay.format());
                        console.log("calendarDay:"+calendarDay.dateStr);
                        console.log("nextCalendarDay:"+nextCalendarDay.dateStr);
                        calendarDay.isBusy=true;
                        if(shouldMarkNextDay) {
                            nextCalendarDay.isBusy=true;
                        }
                    }
                    calendarDay.available=Math.max(calendarDay.available-count,0);
                    nextCalendarDay.available=Math.max(nextCalendarDay.available-count,0);
            });
        });
    }

    function generateWeeksWithDays(start,weeks) {
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
                    ,ordersFromPrevious: 0
                    ,week: runnerDate.week()
                    ,isWeekend: (runnerDate.weekday() == 5 || runnerDate.weekday()==6)
                    ,momentDate: runnerDate.clone()
                };
                //console.log("weekDayObj:"+weekDayObj.label+":"+weekDayObj.isWeekend+", week:"+weekDayObj.week);
                if(!weekDayObj.isPast && weekDayObj.isCurrentMonth && !weekDayObj.isWeekend) {
                    weekDayObj.isAvailable=true;
                }else
                    weekDayObj.available=0;

                week.days.push(weekDayObj);
                runnerDate.add('d', 1);
            }
            weeks.push(week);
        }
    }

    var generateCalendarMonthView = function (start) {
        var calendarView={weeks: []};
        generateWeeksWithDays(start,calendarView.weeks);
        addOrderCountsAndMarkBusy(start, calendarView.weeks);
        //markGreenPeriods(start, calendarView);
        return calendarView;
    };
    return{
        generateCalendarMonthView: generateCalendarMonthView //api
    }
});

