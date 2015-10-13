'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var SubscriberActions = require('../../actions/SubscriberActions');

var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;

var _ = require('lodash');

var EmailModal = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired,
        getStore: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return { 
            showModal: false,
            hasSubscribed: false,
            isValid: null,
            bsStyle: null,
            label: 'Email'
        };
    },
    componentWillMount: function () {
        //this.context.executeAction(SubscriberActions.getClosedPopupStatus);
        this.context.getStore('AuthStore').addChangeListener(this.onStoreChange);
        this.setState(this.getStateFromStores());
    },
    componentWillUnmount: function () {
        this.context.getStore('AuthStore').removeChangeListener(this.onStoreChange);
    },
    getStateFromStores: function() {
        var hasClosedPopup =  this.context.getStore('AuthStore').getClosedPopupStatus();
        var shouldOpenPopup = this.context.getStore('AuthStore').shouldOpenPopup();

        return {
            hasClosedPopup: hasClosedPopup,
            shouldOpenPopup: shouldOpenPopup
        };
    },
    onStoreChange: function () {
        this.setState(this.getStateFromStores());
        var shouldOpenPopup = this.context.getStore('AuthStore').shouldOpenPopup();
        if(shouldOpenPopup) this.open();
    },
    close: function() {
        this.context.executeAction(SubscriberActions.hasClosedPopup);
        this.setState({ showModal: false });
    },
    open: function() {
        this.setState({ 
            showModal: true, 
            hasSubscribed: false,  
            isValid: null,
            bsStyle: null,
            label: 'Email'  
        });
    },
    render: function() {
        return (
            <Modal show={this.state.showModal} onHide={this.close} className="email-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Newsletter</Modal.Title>
                    {this.renderModalBody()}
                </Modal.Header>
            </Modal>
        );
    },
    renderModalBody: function() {
        if(this.state.hasSubscribed) {
            return (
                <Modal.Body>
                    <p>Merci !</p>
                </Modal.Body>
            );
        } else {
            return (
                <Modal.Body>
                    <p>Vous souhaitez être tenu(e) au courant de l'actualité de Hairfie, de nos conseils et bons plans coiffure du moment ?</p>
                    <p>
                        <Input type="email" ref="email" label={this.state.label} bsStyle={this.state.bsStyle} placeholder="julia@hairfie.com" onBlur={this.validateEmailInput} />
                        <Button onClick={this.addSubscriber} className="btn btn-red">S'inscrire</Button>
                    </p>
                    <p>Promis, on garde l'email pour nous et pas de spam.</p>
                </Modal.Body>
            )
        }
    },
    validateEmailInput: function() {
        var email = this.refs.email.getValue();
        var valid = validateEmail(email);
        if(valid) {
            this.setState({
                isValid: true,
                bsStyle: 'success'
            })
        } else {
            this.setState({
                isValid: false,
                bsStyle: 'error',
                label: 'Email non valide'
            })
        }

    },
    addSubscriber: function() {
        var modal = this;
        if(!this.state.isValid) return;

        var email = this.refs.email.getValue();

        this.context.executeAction(SubscriberActions.submit, {
            subscriber        : {
                email       : email
            }
        });
        this.setState({ hasSubscribed: true }, function () {
            this.context.executeAction(SubscriberActions.hasClosedPopup);
            heap.identify({email: email});
            setTimeout(function() {
               modal.close();
            }, 2000);
        });
    }
});

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

module.exports = EmailModal;