/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var FlashStore = require('../stores/FlashStore');
var FlashActions = require('../actions/Flash');
var Alert = require('react-bootstrap/Alert');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [FlashStore]
    },
    getStateFromStores: function () {
        return {
            messages: this.getStore(FlashStore).getMessages()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var messages = this.state.messages || [];

        return (
            <div>
                {messages.map(this.renderMessage)}
            </div>
        );
    },
    renderMessage: function (message) {
        var type;
        switch (message.type) {
            case 'SUCCESS':
                type = 'success';
                break;
            case 'FAILURE':
                type = 'danger';
                break;
        }

        return (
            <Alert key={message.id} bsStyle={type} onDismiss={this.closeMessage.bind(this, message)}>
                {message.body}
            </Alert>
        );
    },
    closeMessage: function (message) {
        this.props.context.executeAction(FlashActions.CloseMessage, {
            message: message
        });
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});