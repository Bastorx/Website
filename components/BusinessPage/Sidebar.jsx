'use strict';

var React = require('react');
var Calendar = require('../Form/BookingCalendarComponent.jsx');
var NavLink = require('flux-router-component').NavLink;
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var SimilarBusinesses = require('./SimilarBusinesses.jsx');

module.exports = React.createClass({
    mixins: [NavToLinkMixin],
    render: function () {
        return (
            <div className="sidebar col-sm-4">
                {this.renderCalendar()}
                {this.renderBookNow()}
                {this.renderSimilarBusinesses()}
            </div>
        );
    },
    renderCalendar: function () {
        var business = this.props.business || {};

        return (
            <div className="calendar hidden-xs">
                <Calendar ref="calendar" timetable={business.timetable} />
            </div>
        );
    },
    renderBookNow: function () {
        var business = this.props.business;

        if (!business) return;

        return (
            <div className="promo-sidebar">
                {this.renderBestDiscount()}
                <NavLink
                    className="btn btn-red hidden-xs"
                    routeName="book_business"
                    navParams={{businessId: business.id, businessSlug: business.slug}}
                    onClick={this.book}>
                    Réserver maintenant
                </NavLink>
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
    renderSimilarBusinesses: function () {
        if (!this.props.similarBusinesses) return;

        return <SimilarBusinesses businesses={this.props.similarBusinesses} />;
    },
    book: function (e) {
        e.preventDefault();

        var business = this.props.business || {};
        var pathParams = {businessId: business.id, businessSlug: business.slug};
        var queryParams = {date: this.refs.calendar.getDate()};

        this.navToLink('book_business', pathParams, queryParams);
    }
});
