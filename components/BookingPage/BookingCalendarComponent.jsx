/** @jsx React.DOM */

'use strict';

var React = require('react'),
    moment = require('moment');

var _ = require('lodash');

require('moment-range');

var weekDaysNumber = require('../../constants/DateTimeConstants').weekDaysNumber;

module.exports = React.createClass({
    getInitialState: function() {
        var today = new Date();
        return {
            month: today,
            today: today,
            selectedDate: this.props.selectedDate,
            timetable: this.props.timetable || {}
        };
    },
    prevMonth: function(ev) {
        this.setState({
            month: moment(this.state.month).add(-1, 'months').toDate()
        });
    },
    nextMonth: function(ev) {
        this.setState({
            month: moment(this.state.month).add(1, 'months').toDate()
        });
    },
    render: function() {
        var start = moment(this.state.month).startOf('month').startOf('isoWeek'),
            m = moment(this.state.month),
            stop = moment(this.state.month).endOf('month').endOf('isoWeek'),
            month = [];

        moment().range(start, stop).by('weeks', function(w) {
            var week = [];
            moment().range(w, moment(w).endOf('isoWeek')).by('days', function(d) {
                week.push(d);
            });
            month.push(week);
        });

        return (
            <div className="calendar">
                <table className="cal">
                    <caption>
                        <span className="prev" onClick={this.prevMonth}><a href="#"></a></span>
                        <span className="next" onClick={this.nextMonth}><a href="#"></a></span>
                        {m.format('MMMM YYYY')}
                    </caption>
                    <thead>
                        <tr>
                            <th>Lun</th>
                            <th>Mar</th>
                            <th>Mer</th>
                            <th>Jeu</th>
                            <th>Ven</th>
                            <th>Sam</th>
                            <th>Dim</th>
                        </tr>
                    </thead>
                    <tbody>
                        { month.map(this.renderWeekRow) }
                    </tbody>
                </table>
            </div>
        );
    },
    renderWeekRow: function(w) {
        return (
            <tr key={w[0].get('week')}>
                { _.map(w, this.renderDay, this) }
            </tr>
        );
    },
    renderDay: function(d) {
        var currentTimetable = this.state.timetable[weekDaysNumber[d.day()]];

        var cls = d.isSame(this.state.today, 'day') ? 'today' : '';
        if (this.state.selectedDate && d.isSame(this.state.selectedDate, 'day')) cls += ' active';
        var tomorrow = moment().add(1, 'days');

        // Display Text : to refactor
        var isOpen, discount, discountNode;
        var text = d.get('date');
        if(currentTimetable && currentTimetable.length > 0) {
            isOpen = true;
            _.each(currentTimetable, function(timewindow) {
                if(timewindow.discount) {
                    if(!discount) {
                        discount = timewindow.discount;
                    } else {
                        discount = timewindow.discount > discount ? timewindow.discount : discount;
                    }
                }
            });
            if(discount) {
                discountNode = (<span className="promo-day">{discount}%</span>);
                cls += ' discount';
            }
        } else {
            isOpen = false;
        }
        var text;

        if(d.isAfter(tomorrow, 'day') && isOpen) {
            cls += ' bookable'
            return <td className={cls} key={d.get('date')} onClick={this.dayCallback(d)}>{}<a href="#">{discountNode}{text}</a></td>;
        } else {
            cls += ' off';
            return <td className={cls} key={d.get('date')}>{ d.get('date') }</td>;
        }

    },
    dayCallback: function(m) {
        var self = this;
        return function(ev) {
            self.setState({
                selectedDate: m
            });
            self.props.onDayChange && self.props.onDayChange(m);
        };
    }
});
