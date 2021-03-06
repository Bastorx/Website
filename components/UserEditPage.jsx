'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PublicLayout = require('./PublicLayout.jsx');
var ImageField = require('./Partial/ImageField.jsx');
var Input = require('react-bootstrap').Input;
var UserConstants = require('../constants/UserConstants');
var UserActions = require('../actions/UserActions');

var UserEditPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function() {
        return { userGender: this.props.user ? (this.props.user.gender || "") : "" };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({ userGender: nextProps.user ? (nextProps.user.gender || "") : "" });
    },
    render: function () {
        return(
            <PublicLayout>
                <div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                    <h2>Edition du profil</h2>
                    <form className="form">
                        <Input className="radio">
                          <label className="radio-inline">
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE}  />
                            Homme
                          </label>
                          <label className="radio-inline" style={{marginLeft: '0px'}}>
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                            Femme
                            </label>
                        </Input>
                            <Input type="text" ref="firstName" placeholder="Prénom" defaultValue={this.props.user.firstName || ""} />
                            <Input type="text" ref="lastName" placeholder="Nom" defaultValue={this.props.user.lastName || ""}/>
                            <Input type="email" ref="email" placeholder="Adresse Email" defaultValue={this.props.user.email || ""}/>
                            <Input type="text" ref="phoneNumber" placeholder="Numéro de portable" defaultValue={this.props.user.phoneNumber || ""} />
                        <div className="form-group">
                          <ImageField ref="picture" defaultPicture={this.props.user.picture} container="users"/>
                        </div>
                        <a role="button" onClick={this.submit} className="btn btn-red full">Valider</a>
                    </form>
                </div>
            </PublicLayout>
        );
    },
    handleGenderChanged: function (e) {
        this.setState({
            userGender: e.currentTarget.value
        });
    },
    submit: function(e) {
        e.preventDefault();

        var userInfo = {
            email: this.refs.email.getValue() || undefined,
            firstName: this.refs.firstName.getValue() || undefined,
            lastName: this.refs.lastName.getValue() || undefined,
            //password: this.refs.password.getValue() || undefined,
            gender: this.state.userGender || undefined,
            phoneNumber: this.refs.phoneNumber.getValue() || undefined,
            picture: this.refs.picture.getImage() || undefined
        };

        this.context.executeAction(UserActions.editUser, userInfo);
    }
});

UserEditPage = connectToStores(UserEditPage, [
    'AuthStore',
    'UserStore'
], function (context, props) {
    var userId = context.getStore('AuthStore').getUserId();
    return {
        user: context.getStore('UserStore').getById(userId)
    };
});

module.exports = UserEditPage;