/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var Layout = require('./ProLayout.jsx');
var _ = require('lodash');

var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness(),
            loading: this.getStore(BusinessStore).isUploadInProgress(),
            fileInput: null
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business;
        var pictureNodes = business.pictures.map(function(picture) {
            return this.renderPicture(picture);
        }, this);

        pictureNodes.push(this.renderNewPicture());

        return (
            <Layout context={this.props.context} business={business}>
                <h2>Photos du salon</h2>
                {pictureNodes}
            </Layout>
        );
    },
    renderPicture: function(picture) {
        return (
            <div className="col-sm-6 col-md-4 business-item" key={picture.url}>
                <div className="thumbnail">
                    <img src={picture.url} className="img-responsive" />
                </div>
            </div>
        );
    },
    renderNewPicture: function() {
        console.log("loading", this.state.loading);
        if (this.state.loading) {
            return (
                <div className="col-sm-6 col-md-4 business-item">
                    <div className="thumbnail">
                        Upload en cours
                    </div>
                </div>
            );
        } else {
            return (
                <div className="col-sm-6 col-md-4 business-item">
                    <div className="thumbnail">
                        <input className="btn btn-primary" type="file" accept="image/*" ref="newPhoto" value={this.state.fileInput} onChange={this.handleChange} />
                    </div>
                </div>
            );
        }
    },
    onChange: function() {
        this.setState(this.getStateFromStores());
    },
    handleChange: function(event) {
        this.setState({fileInput: event.target.value, business: this.state.business});
        this._uploadPicture(event.target.files[0]);
    },
    _uploadPicture: function(file) {
        this.props.context.executeAction(BusinessActions.AddPicture, {
            pictureToUpload: file,
            business: this.state.business
        });
    }
});
