'use strict';

var define = require('../lib/constants/define');
var _ = require('lodash');

module.exports = {
    Weekdays: define([
        'MON',
        'TUE',
        'WED',
        'THU',
        'FRI',
        'SAT',
        'SUN'
    ]),
    weekDaysNumber: {
        0: 'SUN',
        1: 'MON',
        2: 'TUE',
        3: 'WED',
        4: 'THU',
        5: 'FRI',
        6: 'SAT'
    },
    weekDaysNumberFR: {
        0: 'MON',
        1: 'TUE',
        2: 'WED',
        3: 'THU',
        4: 'FRI',
        5: 'SAT',
        6: 'SUN'
    },
    weekDayLabel: function(wd) {
        return ({
            MON: 'Monday',
            TUE: 'Tuesday',
            WED: 'Wednesday',
            THU: 'Thursday',
            FRI: 'Friday',
            SAT: 'Saturday',
            SUN: 'Sunday'
        })[wd];
    },
    weekDayLabelFR: function(wd) {
        return ({
            MON: 'Lundi',
            TUE: 'Mardi',
            WED: 'Mercredi',
            THU: 'Jeudi',
            FRI: 'Vendredi',
            SAT: 'Samedi',
            SUN: 'Dimanche'
        })[wd];
    },
    weekDayLabelFromInt: function(i) {
        return module.exports.weekDayLabelFR(module.exports.weekDaysNumber[i]);
    },
    orderWeekDays: function(days) {
        var sortedDays = [];

        _.each(module.exports.Weekdays, function(day) {
            if(days.indexOf(day) > -1) sortedDays.push(day);
        });

        return sortedDays;
    }
};
