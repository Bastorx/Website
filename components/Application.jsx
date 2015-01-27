/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var RouterMixin = require('flux-router-component').RouterMixin;
var RouteStore = require('../stores/RouteStore');

var NotFoundPage = require('./NotFoundPage.jsx');
var BusinessInfosPage = require('./BusinessInfosPage.jsx');

var ga = require('../services/analytics');

module.exports = React.createClass({
    mixins: [StoreMixin, RouterMixin],
    statics: {
        storeListeners: [RouteStore]
    },
    getStateFromStores: function () {
        return {
            route: this.getStore(RouteStore).getCurrentRoute()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var route = this.state.route;
        if (route && route.config && route.config.pageComponent) {
            ga('send', 'pageview', {
                'page': route.path
            });

            return React.createElement(route.config.pageComponent, {
                context : this.props.context,
                route   : route
            });
        } else {
            return <NotFoundPage context={this.props.context} />
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
