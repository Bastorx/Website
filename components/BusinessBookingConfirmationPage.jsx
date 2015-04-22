'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var moment = require('moment');
var _ = require('lodash');

var BookingStore  = require('../stores/BookingStore');
var PublicLayout  = require('./PublicLayout.jsx');

var NavLink = require('flux-router-component').NavLink;

var UserConstants = require('../constants/UserConstants');
var BookingActions = require('../actions/Booking');

var Jumbotron = require('react-bootstrap/Jumbotron');
var Button = require('react-bootstrap/Button');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');

var DateTimeConstants = require('../constants/DateTimeConstants');
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;
var weekDaysNumber = DateTimeConstants.weekDaysNumber;


module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BookingStore]
    },
    getStateFromStores: function () {
        return {
            booking: this.getStore(BookingStore).getById(this.props.route.params.bookingId)
        }
    },
    getInitialState: function () {
        return this.getStateFromStores()
    },
    render: function () {
        if(_.isUndefined(this.state.booking)) {
            return (
                <PublicLayout context={this.props.context} customClass="booking confirmation">
                    <div className="loading" />
                </PublicLayout>
            )
        } else {
            var booking  = this.state.booking;
            var business = booking.business;
            var address  = business.address;
            return (
                <PublicLayout context={this.props.context} customClass="booking confirmation">
                    <div className="container reservation" id="content" >
                        <div className="row">
                            <div className="main-content col-md-9 col-sm-12 pull-right">
                                <div className="legend conf">
                                    <h3 className="green"> Réservation enregistrée ! </h3>
                                    <p>
                                        Votre réservation a bien été bien prise en compte, vous allez recevoir un email dans quelques instants vous confirmant votre demande.
                                        En attendant, n'hésitez pas à télécharger l'application Hairfie ou à aller vous inspirez en regardant les Hairfies déjà postés par votre salon.
                                    </p>
                                </div>
                                <a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" className="pull-right" target="_blank" >Télécharger l'application</a>
                                <div className="clearfix"></div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-6">
                                        <h3>Votre demande</h3>
                                        <dl className="dl-horizontal">
                                            <dt>Date :</dt>
                                            <dd>{moment(booking.timeslot).format("dddd D MMMM YYYY [à] HH:mm")}</dd>
                                            <dt>Horaire :</dt>
                                            <dd>{moment(booking.timeslot).format("HH:mm")}</dd>
                                            {this.renderDiscount(booking)}
                                            <dt>Note :</dt>
                                            <dd>{booking.comment}</dd>
                                            <dt>Nom du salon :</dt>
                                            <dd>{business.name}</dd>
                                            <dt>Adresse :</dt>
                                            <dd>{address.street} {address.zipCode} {address.city}</dd>
                                            <dt>Téléphone :</dt>
                                            <dd>{business.phoneNumber}</dd>
                                        </dl>
                                    </div>
                                    <div className="col-sm-6">
                                        <h3>Vos coordonnées</h3>
                                        <dl className="dl-horizontal">
                                            <dt>Votre Nom :</dt>
                                            <dd>{booking.firstName} {booking.lastName}</dd>
                                            <dt>Votre Email :</dt>
                                            <dd>{booking.email}</dd>
                                            <dt>Numéro de téléphone :</dt>
                                            <dd>{booking.phoneNumber}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <LeftColumn context={this.props.context} business={this.state.booking.business} />
                        </div>
                    </div>
                    <div className="row" />
                </PublicLayout>
            );
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    renderDiscount: function(booking) {
        if (!booking.discount) return;

        return (
            <div>
                <dt>Votre promotion :</dt>
                <dd>-{booking.discount} % sur toute la carte</dd>
            </div>
        );
    }
});
