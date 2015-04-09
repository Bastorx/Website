/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var TopDealsStore = require('../../stores/TopDealsStore');
var lodash = require('lodash');
var NavLink = require('flux-router-component').NavLink;
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    mixins: [FluxibleMixin, NavToLinkMixin],
    statics: {
        storeListeners: [TopDealsStore]
    },
    getStateFromStores: function () {
        return {
            topDeals   : this.getStore(TopDealsStore).get(this.props.numTopDeals)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        return (
            <section className="home-section">
                <h2>Nos offres actuelles</h2>
                <div className="row">
                    {lodash.map(this.state.topDeals, this.renderDeal).slice(0, 3)}
                </div>
                <div className="row">
                    {lodash.map(this.state.topDeals, this.renderDeal).slice(3, 6)}
                </div>
                {/* <a href="#" className="btn btn-red home-cta col-md-3 col-xs-10">Plus de bons plans</a> */}
            </section>
        );
    },
    renderDeal: function (deal) {
        var displayAddress = deal.business.address ? deal.business.address.street + ' ' + deal.business.address.city : null;

        return (
            <div className="col-sm-4 col-xs-12" key={deal.business.id}>
                <figure>
                    <Picture picture={deal.business.pictures[0]} resolution={{width: 640, height: 400}} placeholder="/images/placeholder-640.png" alt={deal.business.name} onClick={this.navToLink.bind(this, "show_business", {businessId: deal.business.id, businessSlug: deal.business.slug}, null)} />
                    <figcaption>
                        <NavLink routeName="show_business" navParams={{businessId: deal.business.id, businessSlug: deal.business.slug}} context={this.props.context}>
                            {deal.business.name}
                        </NavLink>
                        <NavLink className="address" routeName="show_business" navParams={{businessId: deal.business.id, businessSlug: deal.business.slug}} context={this.props.context}>
                            {displayAddress}
                        </NavLink>
                        <span className="icon-promo">{deal.discount}%</span>
                    </figcaption>
                </figure>
            </div>
        );
    },
});