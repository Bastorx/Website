/** @jsx React.DOM */

var React = require('react');

var AuthActions = require('../actions/Auth');
var UserConstants = require('../constants/UserConstants');
var BusinessKinds = require('../constants/BusinessConstants').Kinds;

var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var AddressInput = require('./Form/AddressInput.jsx');

var KindChoice = React.createClass({
    getInitialState: function () {
        return {
            kind: this.props.defaultValue || BusinessKinds.SALON
        };
    },
    render: function () {
        return (
            <Input className="radio">
                <label className="radio-inline">
                  <input type="radio" name="businessKind" ref="businessKind" value={BusinessKinds.SALON} />
                  En Salon
                </label>
                <label className="radio-inline">
                  <input type="radio" name="businessKind" ref="businessKind" value={BusinessKinds.HOME} />
                  À domicile
                </label>
            </Input>
        );
    },
    renderButton: function (kind, label) {
        return (
            <Button className="btn-block" active={this.state.kind == kind} onClick={this.choose.bind(this, kind)}>
                {label}
            </Button>
        );
    },
    choose: function (kind) {
        this.setState({kind: kind});
    },
    getValue: function () {
        return this.state.kind;
    }
});

module.exports = React.createClass({
    render: function () {
        return (
            <PublicLayout context={this.props.context} withLogin={true} customClass={'home-pro'}>
                <div className="row first">
                    <div className="col-sm-7 col-md-5 col-md-offset-1 left">
                        <h1>Augmentez votre visibilité et votre chiffre d'affaires</h1>
                        <hr />
                        <p className="list">
                            <ul>
                                <li><span>Gagnez en <strong>visibilité</strong> sur le web et les réseaux sociaux</span></li>
                                <li><span><strong>Différenciez-vous</strong> de vos concurrents</span></li>
                                <li><span>Augmentez votre <strong>chiffre d'affaires</strong></span></li>
                                <li><span>Gagnez du <strong>temps</strong> et concentrez vous sur votre métier</span></li>
                            </ul>
                        </p>

                        <p className="btn-app-store">
                            <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="btn btn-lg">
                                <img id="btn-apple" src="/img/btn-apple@2x.png" />
                            </a>
                        </p>
                    </div>

                    <div className="col-sm-5 col-md-4 col-md-offset-1">
                        <form role="form" className="claim">
                            <h3>Vous êtes un <strong>professionnel</strong> de la coiffure ?</h3>
                            <Input className="radio">
                                <label className="radio-inline">
                                  <input type="radio" name="gender" ref="userGender" value={UserConstants.Genders.MALE} />
                                  Homme
                                </label>
                                <label className="radio-inline">
                                  <input type="radio" name="gender" ref="userGender" value={UserConstants.Genders.FEMALE} />
                                  Femme
                                </label>
                            </Input>
                            <Input ref="userFirstName" type="text"  placeholder="Prénom" />
                            <Input ref="userLastName" type="text" placeholder="Nom" />
                            <Input ref="userEmail" type="email" placeholder="Email" />
                            <Input ref="userPassword" type="password" placeholder="Choisissez un mot de passe" />
                            <hr />

                            <KindChoice ref="businessKind" />
                            <Input ref="businessName" type="text" placeholder="Nom de votre société" />
                            <AddressInput ref="businessAddress" placeholder="Adresse postale" />
                            <Input ref="businessPhoneNumber" type="text" placeholder="Numéro de téléphone" />
                            <Button className="btn-red btn-block" onClick={this.submit}>Commencer maintenant !</Button>
                        </form>
                    </div>
                </div>
            </PublicLayout>
        );
    },
    submit: function (e) {
        e.preventDefault();
        this.props.context.executeAction(AuthActions.Signup, {
            user        : {
                gender      : this.refs.userGender.getDOMNode().value,
                firstName   : this.refs.userFirstName.getValue(),
                lastName    : this.refs.userLastName.getValue(),
                email       : this.refs.userEmail.getValue(),
                password    : this.refs.userPassword.getValue()
            },
            business    : {
                kind        : this.refs.businessKind.getValue(),
                name        : this.refs.businessName.getValue(),
                phoneNumber : this.refs.businessPhoneNumber.getValue(),
                address     : this.refs.businessAddress.getAddress(),
                gps         : this.refs.businessAddress.getGps()
            }
        });
    }
});

