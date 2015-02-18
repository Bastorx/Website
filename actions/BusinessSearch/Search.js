'use strict';

var BusinessSearchEvents = require('../../constants/BusinessSearchConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessSearchEvents.SEARCH);

    context
        .getHairfieApi()
        .search(payload.query, payload.isGeoipable)
        .then(function (businesses) {
            context.dispatch(BusinessSearchEvents.SEARCH_SUCCESS, {
                businesses: businesses
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessSearchEvents.SEARCH_FAILURE);
            done(error);
        });
};
