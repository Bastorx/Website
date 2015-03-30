'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var SimilarBusinessStore = require('../../stores/SimilarBusinessStore');
var NavLink = require('flux-router-component').NavLink;
var Picture = require('../Partial/Picture.jsx');
var _ = require('lodash');

var BusinessLink = React.createClass({
    render: function () {
        var params = {
            businessId  : this.props.business.id,
            businessSlug: this.props.business.slug
        };

        return (
            <NavLink {...this.props} routeName="show_business" navParams={params}>
                {this.props.children}
            </NavLink>
        );
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [SimilarBusinessStore]
    },
    propTypes: {
        businessId  : React.PropTypes.string.isRequired,
        limit       : React.PropTypes.number
    },
    getDefaultProps: function () {
        return {
            limit: 3
        }
    },
    getStateFromStores: function (props) {
        var props = props || this.props;

        return {
            businesses: this.getStore(SimilarBusinessStore).list(props.businessId, props.limit)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    },
    render: function () {
        return (
            <div className="related-content">
                <h5>Les coiffeurs similaires</h5>
                {_.map(this.state.businesses, this.renderBusiness)}
            </div>
        );
    },
    renderBusiness: function (business) {
        return (
            <section key={business.id} className="rival">
                <div className="row">
                    <BusinessLink className="col-xs-4" context={this.props.context} business={business}>
                        <Picture
                            picture={business.pictures[0]}
                            resolution={{width: 90, height: 90}}
                            alt="" />
                    </BusinessLink>
                    <BusinessLink className="col-xs-8" context={this.props.context} business={business}>
                        <span>{business.name}</span>
                        {_.values(_.pick(business.address, ['street', 'zipCode', 'city'])).join(', ')}
                    </BusinessLink>
                </div>
            </section>
        );
    }
});