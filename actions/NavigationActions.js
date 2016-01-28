'use strict';

var navigateAction = require('fluxible-router').navigateAction;

module.exports = {
    navigate: function navigate(context, params) {
        var url = params.url || context.getStore('RouteStore').makeUrl(params.route, params.params, params.query);

        if (params.noNav) {
        	return window.history.pushState("", "", url);
        }
        return context.executeAction(navigateAction, { url: url });
    }
};
