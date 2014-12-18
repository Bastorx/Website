'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    hairfieApi
        .deleteBusinessFacebookPage(payload.business, context.getAuthToken())
        .then(function (facebookPage) {
            context.dispatch(BusinessEvents.RECEIVE_FACEBOOK_PAGE_SUCCESS, {
                business: payload.business,
                facebookPage: null
            });
        });
};
