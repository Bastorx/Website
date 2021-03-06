'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');
var User = require('./User.jsx');
var SearchBar = require('./SearchBar.jsx');
var Picture = require('../Partial/Picture.jsx');
var PopUp = require('./PopUp.jsx');
var Button = require('react-bootstrap').Button;
var classNames = require('classnames');

var Header = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            displaySearch: false,
            displayMenu: false,
            tab: "",
            findMe: false
        };
    },
    componentWillReceiveProps: function(props) {
        if (props.displaySearch) { 
            this.setState({displaySearch: props.displaySearch}); 
        }
        this.setState({tab: ""});
    },
    componentDidUpdate: function() {
        if (this.state.displayMenu || this.state.displaySearch)
            $('body').addClass('locked');
        else
            $('body').removeClass('locked');        
    },
    render: function() {
        return (
            <div>
                {this.renderMobile()}
                {this.renderDesktop()}
            </div>
        );
    },
    renderMobile: function (withProLink) {
        var searchClass = classNames({
            'col-xs-4 menu-search pull-right': true,
            'close': this.state.displaySearch
        });
        var triggerClass = classNames({
            'col-xs-4 menu-trigger pull-right': true,
            'close': this.state.displaySearch || this.state.displayMenu
        });
        var searchBarClass = classNames({
            'search-menu': true,
            'hidden': !this.state.displaySearch
        });
        return (
            <div className="mobile-nav visible-xs">
                <header className="container white visible-xs">
                    <Link className="logo col-xs-4" route="home" />
                        <nav className='col-md-8 pull-right menu-button'>
                            <a className={triggerClass} role="button" onClick={this.handleDisplayMenu}></a>
                            <a className={searchClass} role="button" onClick={this.handleDisplaySearch}></a>
                        </nav>
                    
                </header>
                {/*this.state.displaySearch ? <SearchBar ref='searchbar' mobile={true} findMe={this.props.findMe} close={this.mobileClose}/> : this.renderMobileMenu()*/}
                <SearchBar ref='searchbar' className={searchBarClass} mobile={true} findMe={this.state.findMe} close={this.mobileClose}/>
                {this.renderMobileMenu()}
            </div>
        );
    },
    renderMobileMenu: function() {
        if (!this.state.displayMenu) return;
        return (
            <div className="mobile-menu">
                <ul>
                    <User mobile={true} />
                    <a role="button"><li onClick={this.handleDisplaySearch} className="search-nav">Recherche</li></a>
                    <Link route="business_search" params={{address: 'France'}}><li className="salon" onClick={this.mobileClose}>Tous les coiffeurs</li></Link>
                    <Link route="hairfie_search" params={{address: 'France'}}><li className="hairfies" onClick={this.mobileClose}>Tous les hairfies</li></Link>
                    <a href="http://blog.hairfie.com" target="_blank"><li className="blog">Le blog d'Hairfie</li></a>
                    <Link route="home_pro"><li className="salon" onClick={this.mobileClose}>Gérez votre salon</li></Link>
                    <Link route="newsletter"><li className="blog" onClick={this.mobileClose}>Newsletter</li></Link>
                    <Link route="sms_us"><li className="sms" onClick={this.mobileClose}>Prendre RDV par SMS</li></Link>
                </ul>
            </div>
        );
    },
    renderDesktop: function () {
        var headerClassName = this.props.home ? 'home' : 'white';
        var support = null;
        if (_.isUndefined(this.props.displaySupport) || this.props.displaySupport != false)
            support = null;//<a href="tel://+33185089169">Support : +33 1 85 08 91 69</a>;
        return (
            <div>
                <div className={"hidden-xs shadow " + (this.state.tab ? ' active' : ' inactive')} onClick={this.handleTabChange.bind(null, "")}/>
                <header className={headerClassName + ' hidden-xs'}>
                    <div className="dark-header">
                        <div className="container">
                            <div className="col-sm-4 col-md-4 col-lg-5" style={{paddingLeft: 0}}>
                                <Link route="home_pro">Vous gérez un salon ?</Link>
                            </div>
                            <div className="col-sm-8 col-md-8 col-lg-7" style={{textAlign: "end", paddingRight: 0}}>
                                {support}
                                <Link  route="howitworks_page">Comment ça marche ?</Link>
                                <User />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="col-sm-2 col-md-3" style={{paddingLeft: 0}}>
                            <Link route="home" className="logo" />
                        </div>
                        <ul className="col-sm-7 col-md-6 white-header">
                            {this.state.tab ? <PopUp tab={this.state.tab} handleClose={this.desktopPopupClose} /> : ""}
                            <li>
                                <a role="button" onClick={this.handleTabChange.bind(null, "business")}>LES COIFFEURS</a>
                                <span className={this.state.tab == "business" ? "active" : "inactive"}>&#9670;</span>
                            </li>
                            <span className="separate">&#9670;</span>
                            <li>
                                <a role="button" onClick={this.handleTabChange.bind(null, "hairfie")}>LES HAIRFIES</a>
                                <span className={this.state.tab == "hairfie" ? "active" : "inactive"}>&#9670;</span>
                            </li>
                            <span className="separate">&#9670;</span>
                            <li>
                                <a href="http://blog.hairfie.com" target="_blank">LE BLOG</a>
                            </li>
                        </ul>
                        <Button className="col-sm-3 col-md-3 btn-search" onClick={this.handleDisplaySearch}>
                            Recherchez
                        </Button>
                    </div>
                </header>
                <div className="container">
                    {this.props.home ? null : <SearchBar mobile={false} displaySearch={this.state.displaySearch} close={this.desktopClose} />}
                </div>
            </div>
        );
    },
    handleTabChange: function(tab, e) {
        if (tab != this.state.tab) {
            this.setState({tab: tab});
        }
        else {
            this.setState({tab: ""});
        }
    },
    desktopPopupClose: function() {
        this.setState({tab: ""});
    },
    handleDisplaySearch: function(withFindMe) {
        if(withFindMe == true) this.setState({findMe: true});
        this.setState({displaySearch: !this.state.displaySearch});
    },
    handleDisplayMenu: function() {
        if (this.state.displayMenu || this.state.displaySearch)
            this.setState({displayMenu: false, displaySearch: false});
        else
            this.setState({displayMenu: true});
    },
    mobileClose: function() {
        this.setState({displaySearch: false});
        $('body').removeClass('locked');
        $('.menu-trigger').removeClass('close');
        TweenMax.to('.mobile-menu', 0, {height: '0', minHeight:'0', ease:Power2.easeOut});
    },
    desktopClose: function() {
        this.setState({displaySearch: false});
    },
    disconnect: function() {
        this.context.executeAction(AuthActions.disconnect, this.props.token);
    }
});

module.exports = Header;