/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var NavLink = require('flux-router-component').NavLink;

var AuthStore = require('../stores/AuthStore');
var AuthActions = require('../actions/Auth');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [AuthStore]
    },
    getStateFromStores: function () {
        return {
            user                : this.getStore(AuthStore).getUser(),
            managedBusinesses   : this.getStore(AuthStore).getManagedBusinesses(),
            loading             : this.getStore(AuthStore).isLoginInProgress()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        if (this.state.loading) {
            return (
                <li>
                    <a className="dropdown-toggle" href="#">Login in progress...</a>
                </li>
            );
        } else if (this.state.user) {
            var context = this.props.context;
            var pictureSrc = this.state.user.picture ? this.state.user.picture.url : null;

            var managedBusinesses = this.state.managedBusinesses.map(function (business) {
                return (
                    <li key={business.id}>
                        <NavLink context={context} routeName="pro_business_infos" navParams={{id: business.id, step: 'general'}}>
                            {business.name}
                        </NavLink>
                    </li>
                );
            });

            return (
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle profile-image" data-toggle="dropdown">
                    <img src={pictureSrc + '?width=100&height=100'} className="img-circle profile" /> {this.state.user.firstName} {this.state.user.lastName} <b className="caret"></b></a>
                    <ul className="dropdown-menu account">
                        <li><a href="#" onClick={this.logOut}><i className="fa fa-sign-out"></i> Sign-out</a></li>
                        <li className="divider"></li>
                        <li><NavLink context={this.props.context} routeName="pro_dashboard"><i className="fa fa-cog"></i>Dashboard</NavLink></li>
                        <li className="divider"></li>
                        {managedBusinesses}
                        <li>
                            <NavLink context={this.props.context} routeName="pro_business_new">
                                + claim a business
                            </NavLink>
                        </li>
                    </ul>
                </li>
            );
        } else {
            return (
                <li className="dropdown" id="menuLogin">
                    <a className="dropdown-toggle" href="#" data-toggle="dropdown" id="navLogin">Login</a>
                    <div className="dropdown-menu">
                        <form className="form" id="formLogin">
                            <input type="text" ref="email" placeholder="julia@hairfie.com" />
                            <input type="password" ref="password" placeholder="Password" /><br />
                            <button type="button" id="btnLogin" className="btn" onClick={this.logIn}>Login</button>
                        </form>
                    </div>
                </li>
            );
        }
    },
    logOut: function () {
        this.props.context.executeAction(AuthActions.Logout);
    },
    logIn: function () {
        this.props.context.executeAction(AuthActions.Login, {
            email   : this.refs.email.getDOMNode().value,
            password: this.refs.password.getDOMNode().value
        });
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
