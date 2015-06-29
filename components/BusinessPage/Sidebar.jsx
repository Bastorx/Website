'use strict';

var React = require('react');
var Calendar = require('../Form/BookingCalendarComponent.jsx');
var Link = require('../Link.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var SimilarBusinesses = require('./SimilarBusinesses.jsx');
var PNF = require('google-libphonenumber');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <div className="sidebar col-sm-4">
                {this.renderCalendar()}
                {this.renderBookNow()}
                {this.renderNumberPhone()}
                {this.renderSimilarBusinesses()}
            </div>
        );
    },
    renderCalendar: function () {
        var business = this.props.business || {};
        if (!business.isBookable) return;

        return (
            <div className="calendar">
                <Calendar ref="calendar" timetable={business.timetable} onDayChange={this.book} />
            </div>
        );
    },
    renderBookNow: function () {
        var business = this.props.business;
        if (!business) return;

        var phoneButton = null;
        if (business.displayPhoneNumber)
        {
            
            phoneButton = (

            );
        }
        return (
                <div className="promo-sidebar">
                    {this.renderBestDiscount()}
                    <Link className="btn btn-red" route="business_booking" params={{ businessId: business.id, businessSlug: business.slug }}>
                        Réserver maintenant
                    </Link>
                </div>
        );
    },
    renderBestDiscount: function () {
        var discount = this.props.business && this.props.business.bestDiscount;

        if (!discount) return;

        return (
            <p className="inline-promo">
                <span className="icon-promo">%</span>
                &nbsp;{discount}% dans tout le salon*
            </p>
        );
    },
    renderNumberPhone: function() {
    var business = this.props.business;
    if (business.isBookable && !business.displayPhoneNumber)
        return;
    var phoneNumber = PNF.phoneUtil.parse(business.phoneNumber, 'FR');
    var phone = PNF.phoneUtil.format(phoneNumber, PNF.PhoneNumberFormat.INTERNATIONAL); 
        return (
                <div className="phone">
                    <a href={"tel:" + phone.replace(/ /g,"")} className="btn btn-red">
                        {phone}
                    </a>
                </div>
            );
    },
    renderSimilarBusinesses: function () {
        if (!this.props.similarBusinesses) return;

        return <SimilarBusinesses businesses={this.props.similarBusinesses} />;
    },
    book: function () {
        var business = this.props.business || {};
        var pathParams = {businessId: business.id, businessSlug: business.slug};
        var queryParams = {date: this.refs.calendar.getDate()};

        this.navToLink('business_booking', { businessId: business.id, businessSlug: business.slug }, { date: this.refs.calendar.getDate() });
    }
});
