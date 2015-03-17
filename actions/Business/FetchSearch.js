'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var _ = require('lodash');

module.exports = function (context, payload, done) {
    var done = done || _.noop();

    context.dispatch(BusinessEvents.FETCH_SEARCH, {
        query: payload.query
    });

    context
        .getHairfieApi()
        .getBusinessSearchResult(payload.query)
        .then(function (result) {
            context.dispatch(BusinessEvents.FETCH_SEARCH_SUCCESS, {
                query: payload.query,
                result: result
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessEvents.FETCH_SEARCH_FAILURE, {
                query: payload.query
            });
        });
};
