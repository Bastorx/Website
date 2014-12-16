/** @jsx React.DOM */

var React                = require('react');
var StoreMixin           = require('fluxible-app').StoreMixin;
var InfiniteScrollMixin  = require('./mixins/infinite-scroll.js');
var NavLink              = require('flux-router-component').NavLink;
var HairfieActions       = require('../actions/Hairfie');
var HairfiesStore        = require('../stores/HairfiesStore');
var AuthStore            = require('../stores/AuthStore');

var Button               = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [InfiniteScrollMixin, StoreMixin],
    statics: {
        storeListeners: [HairfiesStore, AuthStore]
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    getStateFromStores: function() {
        return {
            hairfies    : this.getStore(HairfiesStore).getHairfiesForBusiness(this.props.businessId),
            endOfScroll : this.getStore(HairfiesStore).isEndOfScroll(this.props.businessId),
            user        : this.getStore(AuthStore).getUser(),
        }
    },
    fetchNextPage: function (page) {
        if(!this.state.endOfScroll) {
            this.props.context.executeAction(HairfieActions.List, {
                businessId: this.props.businessId,
                limit: 6,
                skip: page*6
            });
        }
    },
    render: function () {
        var hairfiesNodes = this.state.hairfies.map(this.renderHairfie);

        return (
            <div className="hairfies-list">
                {hairfiesNodes}
                <div className="clearfix" />
            </div>
        );
    },
    renderHairfie: function (hairfie) {
        var priceNode, deleteNode;
        if(hairfie.price) {
            priceNode = (<div className="circle">{hairfie.price.amount} {hairfie.price.currency == "EUR" ? "€" : ""}</div>)
        }

        var isAllowedToDelete = (hairfie.author.id === this.state.user.id);

        if(this.props.withDeleteButton && isAllowedToDelete) {
            deleteNode =(<Button onClick={this.deleteHairfie.bind(this, hairfie)} bsStyle="danger" bsSize="xsmall" className="delete-button">X</Button>)
        }
        return (
            <div className="hairfie-picture col-sm-3" key={hairfie.id}>
                <div className="img-container">
                    { priceNode }
                    <NavLink routeName="show_hairfie" navParams={{id: hairfie.id}} context={this.props.context}>
                        <img src={hairfie.picture.url} alt=""/>
                    </NavLink>
                    { deleteNode }
                </div>
            </div>
        );
    },
    deleteHairfie: function(hairfie) {
        this.props.context.executeAction(HairfieActions.Delete, {
            hairfie: hairfie
        });
    }
});
