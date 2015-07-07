'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'UserStore',
    handlers: makeHandlers({
        onReceiveUserInfo: Actions.RECEIVE_USER_INFO
    }),
    initialize: function () {
        this.userInfo = {};
    },
    dehydrate: function () {
        return {
            stations: this.userInfo
        };
    },
    rehydrate: function (state) {
        this.userInfo = state.userInfo || {};
    },
    onReceiveUserInfo: function (userInfo) {
        this.userInfo = userInfo;
        this.emitChange();
    },
    getUserInfo: function()
    {
        return this.userInfo;
    }
});
