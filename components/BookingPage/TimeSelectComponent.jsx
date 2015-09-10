'use strict';

var React = require('react');
var moment = require('moment');
var connectToStores = require('fluxible-addons-react/connectToStores');

var _ = require('lodash');

var DateTimeConstants = require('../../constants/DateTimeConstants');
var weekDaysNumber = DateTimeConstants.weekDaysNumber;
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;

var Button = require('react-bootstrap').Button;

var TimeSelectComponent = React.createClass({
    propTypes: {
        onTimeSlotChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            onTimeSlotChange: _.noop
        };
    },
    getInitialState: function() {
        var today = new Date();
        return {
            timeslotSelected: this.props.timeslotSelected
        };
    },

    render: function() {
        if(!this.props.daySelected) {
            return (<p>Commencez par choisir un jour</p>);
        }
        var daySelected = this.props.daySelected;
        var timeslots = this.props.timeslots[daySelected];
        return(
            <div className="time-table">
                <table className="cal">
                    <tr>
                        { _.map(timeslots, this.renderTimeButton, this) }
                    </tr>
                </table>
            </div>
        );
    },
    renderTimeButton: function(timeslot) {
        var hour = timeslot.startTime;
        var discount = timeslot.discount;
        var label = timeslot.startTime;
        var discountNode;

        var cls = 'btn timeslot';
            cls += timeslot == this.state.timeslotSelected ? ' active' : '';

        if(discount) {
            discountNode = (<span className="promo-day">{discount}%</span>);
        }

        return <td className={cls} onClick={this.timeSlotCallback.bind(null, timeslot, discount)}><a role="button"><p>{label}</p>{discountNode}</a>
            </td>;
    },
    timeSlotCallback: function(timeslot, discount, e) {
        e.preventDefault();
        timeslot = moment(this.props.daySelected + ' ' + timeslot.startTime, "YYYY-MM-DD HH:mm");
        this.setState({ timeslotSelected: timeslot});
        this.props.onTimeSlotChange(timeslot, discount);
    }
});

var TimeSelectComponent = connectToStores(TimeSelectComponent, [
    'TimeslotsStore'
], function (context, props) {
    return {
        timeslots : context.getStore('TimeslotsStore').getById(props.businessId)
    }
});

module.exports = TimeSelectComponent;
