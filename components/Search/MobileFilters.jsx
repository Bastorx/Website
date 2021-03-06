'use strict';

var React = require('react');
var _ = require('lodash');
var RadiusFilter = require('./RadiusFilter.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PlaceActions = require('../../actions/PlaceActions');
var DateTimeConstants = require('../../constants/DateTimeConstants');
var TagSubFilters = require('./TagSubFilters.jsx');
var CategorySubFilters = require('./CategorySubFilters.jsx');
var PromoCheckbox = require('./PromoCheckbox.jsx');
var OpeningDays = require('./OpeningDays.jsx');
var PriceFilterMobile = require('./PriceFilterMobile.jsx');
var Selections = require('./Selections.jsx');
var BusinessNameInput = require('./BusinessNameInput.jsx');
var LocationInput = require('./LocationInput.jsx');
var AutosuggestInput = require('./AutosuggestInput.jsx');

var MobileFilters = React.createClass({    
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    getDefaultProps: function () {
        return {
            onClose: _.noop
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            displayMobileFilters: this.state && this.state.displayMobileFilters || false,
            filtersCategoryToDisplay: {}
        }
    }, 
    render: function () {
        var displayClass = 'new-filters ';
        if (!this.state.displayMobileFilters)
            displayClass += 'hidden';
        return (
            <div>
                <div className="mobile-screen hidden-md hidden-lg">
                    <a role="button" className="btn-red btn-mobile-fixed" onClick={this.handleDisplayMobileFilters}>Filtres</a>
                </div>
                <div className={displayClass}>
                    <a onClick={this.handleDisplayMobileFilters} className="btn-close close-filters">✕</a>
                    {this.renderHairfiesFilters()}
                    {this.renderBusinessFilters()}
                    <div className="filter-footer">
                        <button onClick={this.reset} className="btn btn-red semi">Réinitialiser</button>
                        <button onClick={this.handleChange} className="btn btn-red semi">Valider</button>
                    </div>
                </div>
            </div>
        );
    },
    handleDisplayMobileFilters: function() {
        if(this.state.displayMobileFilters == false)
            $('body').toggleClass('locked');
        else
            $('body').removeClass('locked');
        this.setState({displayMobileFilters: (!this.state.displayMobileFilters)});
    },
    renderBusinessFilters: function() {
        if (this.props.tab != 'business') return;
        return (
            <div>
                <CategorySubFilters 
                    cat={this.state.filtersCategoryToDisplay}
                    tab={this.props.tab}
                    onClose={this.handleCloseMobileSubFilters} 
                    allCategories={this.props.allCategories} 
                    initialSearch={this.state.search}/>
                <OpeningDays 
                    initialSearch={this.state.search}
                    cat={this.state.filtersCategoryToDisplay}
                    onClose={this.handleCloseMobileSubFilters} />
                <PriceFilterMobile
                    initialSearch={this.state.search}
                    cat={this.state.filtersCategoryToDisplay}
                    onClose={this.handleCloseMobileSubFilters} />
                <div className="filter-header">Filtrer par:</div>
                <Selections 
                    initialSearch={this.state.search}
                    cat={this.state.filtersCategoryToDisplay}
                    selections={this.props.selections}
                    handleSelectionChange={this.handleSelectionChange}
                    onClose={this.handleCloseMobileSubFilters}/>
                <div>
                    <LocationInput 
                        ref="locationInput"
                        initialSearch={this.state.search}
                        onSubmit={this.handleChange}
                        currentPosition={this.props.currentPosition} />
                </div>
                <div>
                    <hr className='underliner'/>
                    <PromoCheckbox
                        ref="promoCheckbox"
                        initialSearch={this.state.search} 
                        onChange={this.handlePromoChange}/>
                </div>
                <div>
                    <BusinessNameInput 
                        ref="businessNameInput"
                        initialSearch={this.state.search}
                        onSubmit={this.handleChange}/>
                </div>
                <div>
                    <a role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, 'businessCategories')}>
                        Spécialités {this.countCategories(this.state.search.categories)}
                    </a>
                </div>
                <div>
                    <a role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, 'OpeningDays')}>
                        Jours d'ouverture {this.countCategories(this.state.search.days)}
                    </a>
                </div>
                
                <div>
                    <a role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, 'PriceFilterMobile')}>
                        Prix {this.countCategories(this.state.search.priceLevel)}
                    </a>
                </div>
            </div>
        );
    },
    renderHairfiesFilters: function() {
        if (this.props.tab != 'hairfie') return;

        return (
            <div>
                <TagSubFilters 
                    cat={this.state.filtersCategoryToDisplay} 
                    tab={this.props.tab}
                    onClose={this.handleCloseMobileSubFilters} 
                    allTags={this.props.allTags} 
                    initialSearch={this.state.search}/>
                <div className="filter-header">Filtrer par:</div>
                <h2>Recherche de tags</h2>
                <AutosuggestInput 
                    addTag={this.addTag}
                    tags={this.props.allTags} />
                {_.map(this.props.filterCategories, function (category) {
                        return <a key={category.id} role="button" className="filters-category" onClick={this.handleDisplayMobileSubFilters.bind(this, category)}>
                                    {category.name} 
                                    {this.countTagsByCategory(category)}
                                </a>
                    }.bind(this))}
            </div>
        );
    },
    addTag: function(tag) {
        var newTags = _.isArray(this.state.search.tags) ? this.state.search.tags : [];
        newTags.push(tag);
        this.setState({search: _.assign({}, this.state.search, {tags: newTags})});
    },
    countTagsByCategory: function(category) {
        var categoryTags= _.map(_.groupBy(this.props.allTags, 'category.id')[category.id], function (filter) {
            return filter.name
        });

        var matchingTags = _.filter(this.state.search.tags, function(tag) {
            return _.include(categoryTags, tag)
        });
        var tagClass = matchingTags.length >0 ? 'tag-count' : null;
        return matchingTags.length > 0 ? <span className={tagClass}>{matchingTags.length}</span> : null;
    },
    countCategories: function (arrayToCount) {
        var tagClass = arrayToCount && arrayToCount.length > 0 ? 'tag-count' : null;
        if (typeof arrayToCount === 'undefined' || arrayToCount.length == 0) return '';
        else return <span className={tagClass}>{arrayToCount.length}</span>;
    },
    handleChange: function () {
        if (this.props.tab == 'business') {
            this.setState({search: _.assign({}, this.state.search, 
                {q: this.refs.businessNameInput.getValue(), address: this.refs.locationInput.getValue()})}, function() {
                this.props.onChange(this.state.search);
            });
        }
        else {
            this.props.onChange(this.state.search);
        }
        this.handleDisplayMobileFilters();

    },
    handleSelectionChange: function(selection) {
        if (this.state.search && (this.state.search.selections || []).indexOf(selection) > -1)
            this.setState({search: _.assign({}, this.state.search,{selections: _.without(this.state.search.selections, selection)})});
        else {
                this.refs.locationInput.refs.address.refs.geoSuggest.update('Paris, France');
                this.setState({search: _.assign({}, this.state.search, {address: "Paris, France", selections: _.union(this.state.search.selections || [], [selection])})});
        }
    },
    handlePromoChange: function() {
        this.setState({search: _.assign({}, this.state.search, {withDiscount: !this.state.search.withDiscount})});
    },
    handleDisplayMobileSubFilters: function(category) {
        this.setState({filtersCategoryToDisplay: category});
    },
    handleCloseMobileSubFilters: function(search) {
        if(search) {
            this.setState({search:search});
        }
        this.setState({filtersCategoryToDisplay: {}});
    },
    reset: function () {
        this.setState({search: this.props.initialSearch});
    }
});

MobileFilters = connectToStores(MobileFilters, [
    'PlaceStore'
], function (context, props) {
    return _.assign({}, {
        currentPosition: context.getStore('PlaceStore').getCurrentPosition()
    }, props);
});

module.exports = MobileFilters;
