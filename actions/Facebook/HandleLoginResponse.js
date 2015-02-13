'use strict';

var AuthEvents = require('../../constants/AuthConstants').Events;
var handleLoginResponse = require('./utils').handleLoginResponse;
var authStorage = require('../../services/auth-storage');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    handleLoginResponse(payload.response)
        .then(function (token) {
            return context.getHairfieApi().loginWithFacebookToken(token);
        })
        .then(function (result) {
            authStorage.setToken(result.token);

            context.dispatch(AuthEvents.LOGIN_SUCCESS, {
                user    : result.user,
                token   : result.token
            });
            done();
        })
        .fail(done);
};
