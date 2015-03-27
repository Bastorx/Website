/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../stores/BusinessStore');
var Layout = require('./PublicLayout.jsx');
var BusinessPage = require('./BusinessPage');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function (props) {
        var props = props || this.props;

        return {
            business: this.getStore(BusinessStore).getById(props.route.params.businessId)
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
    componentDidMount: function () {
        TweenMax.to('#content.salon .main-content', 0.5, {top:0,opacity:1,ease:Power2.easeIn});
    },
    render: function () {
        var businessId = this.props.route.params.businessId;
        var business = this.state.business || {};

        return (
            <Layout context={this.props.context}>
                <BusinessPage.Carousel pictures={business.pictures} />
                <div className="container salon" id="content">
                    <div className="main-content col-md-8 col-sm-12" style={{opacity: 1, top: '0px'}}>
                        <BusinessPage.ShortInfos business={business} />
                        <section className="salon-content">
                            <div className="row">
                                <div role="tabpannel">
                                    <div className="row">
                                        <ul className="nav nav-tabs" role="tablist">
                                            <li role="presentation" className="col-xs-4 active">
                                                <a href="#informations" aria-controls="informations" role="tab" data-toggle="tab">
                                                    <span className="icon-nav"></span>
                                                    Informations
                                                </a>
                                            </li>
                                            <li role="presentation" className="col-xs-4">
                                                <a href="#reviews" aria-controls="reviews" role="tab" data-toggle="tab">
                                                    <span className="icon-nav"></span>
                                                    Avis
                                                </a>
                                            </li>
                                            <li role="presentation" className="col-xs-4">
                                                <a href="#hairfies" aria-controls="hairfies" role="tab" data-toggle="tab">
                                                    <span className="icon-nav"></span>
                                                    Hairfies
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content">
                                        <div role="tabpannel" className="tab-pane fade active in" id="informations">
                                            <BusinessPage.InformationsTab context={this.props.context} businessId={businessId} />
                                        </div>
                                        <div role="tabpannel" className="tab-pane fade" id="reviews">
                                            <BusinessPage.ReviewsTab context={this.props.context} businessId={businessId} />
                                        </div>
                                        <div role="tabpannel" className="tab-pane fade" id="hairfies">
                                            <BusinessPage.HairfiesTab context={this.props.context} businessId={businessId} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <BusinessPage.Sidebar context={this.props.context} businessId={businessId} />
                </div>
                <div className="row"></div>
            </Layout>
        );
    }
});
