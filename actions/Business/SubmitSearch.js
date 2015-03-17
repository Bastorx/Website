'use strict';

function noop() {};

var SearchUtils = require('../../lib/search-utils');

module.exports = function SubmitBusinessSearch(context, payload, done) {
    var done = done || noop;

    var pathParams = {address: SearchUtils.locationToUrlParameter(payload.address)};
    var queryParams = {};

    if (!_.isUndefined(payload.radius)) queryParams.radius = payload.radius;

    context.redirect(context.router.makeUrl('business_search_results', pathParams, queryParams));

    done();
};
