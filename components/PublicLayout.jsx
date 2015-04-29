'use strict';

var React = require('react');

var Header = require('./Layout/Header.jsx');
var Footer = require('./Layout/Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');
var SearchBar = require('./Layout/SearchBar.jsx');
var PageProgress = require('./PageProgress.jsx');

module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        return (
            <div className="front">
                <PageProgress context={this.props.context} />
                <div className="container">
                    <Header
                        context={this.props.context}
                        withLogin={this.props.withLogin}
                        loginSuccessUrl={this.props.loginSuccessUrl}
                        headerClass={this.props.headerClass}
                        />
                    {this.renderSearchBar()}
                    <SearchBar context={this.props.context} mobile={true} />
                </div>
                <FlashMessages context={this.props.context} />
                {this.props.children}
                <div className="row" />
                <Footer context={this.props.context} />
                <Footer context={this.props.context} mobile={true} />
            </div>
        );
    },
    renderSearchBar: function () {
        if (!this.props.withSearchBar) return;

        return (
            <div className="row hidden-xs hidden-sm">
                <SearchBar context={this.props.context} />
            </div>
        );
    }
});
