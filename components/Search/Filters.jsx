'use strict';

var React = require('react');
var _ = require('lodash');
var PriceFilter = require('./PriceFilter.jsx');
var RadiusFilter = require('./RadiusFilter.jsx');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PlaceActions = require('../../actions/PlaceActions');
var DateTimeConstants = require('../../constants/DateTimeConstants');


var Filters = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            location: "",
            activeLocation: false
        };
    },
    componentWillReceiveProps: function(newProps) {
        if (newProps.location && this.state.activeLocation) {
            this.setState({
                location: newProps.location
            });
        }
        else if (newProps.place && newProps.place.name) {
            this.setState({
                location: newProps.place.name
            });
        }
    },
    render: function () {
        return (
            <div className="sidebar">
                <h4 style={{textAlign: 'center'}}>Affiner la recherche</h4>
                <section>
                    <form>
                    {this.renderQ()}
                    {this.renderAddress()}
                    {this.renderRadius()}
                    {this.renderCategories()}
                    {this.renderTags()}
                    {this.renderOpenDays()}
                    {this.renderPrice()}
                    {this.renderDiscount()}
                    </form>
                </section>
            </div>
        );
    },
    renderRadius: function () {
        if (!this.props.search.address || this.props.tab == "hairfie") return null;
        return <RadiusFilter min={500} max={10000} defaultValue={this.props.search.radius} onChange={this.handleRadiusChange} />;
    },
    renderPrice: function () {
        var min = 0, max = 1000;

        return <PriceFilter
            min={min}
            max={max}
            defaultMin={this.props.search.priceMin || min}
            defaultMax={this.props.search.priceMax || max}
            onChange={this.handlePriceChange} />;
    },
    renderQ: function () {
        if (!this.props.withQ) return;

        return (
            <div>
                <h2>Nom du coiffeur</h2>
                <div className="input-group">
                    <input className="form-control" ref="query" type="text" defaultValue={this.props.search.q}
                        onKeyPress={this.handleKey}/>
                    <div className="input-group-addon"><a role="button" onClick={this.handleChange}></a></div>
                </div>
            </div>
        );
    },
    renderAddress: function() {
        if (!this.props.withQ) return;

        return (
            <div>
                <h2>Où ?</h2>
                <div className="input-group">
                    <a className="input-group-addon" role="button" onClick={this.findMe} title="Me localiser" />
                    <GeoInput className="form-control" ref="address" type="text"
                        value={this.state.location} onChange={this.handleLocationChange} onKeyPress={this.handleKey}
                        />
                    <div className="input-group-addon" onClick={this.handleChange}><a role="button"></a></div>
                </div>
            </div>
        );
    },
    renderCategories: function () {
        if (!this.props.categories) return;

        var categories = this.props.categories || [];
        if (categories.length == 0) return;
        return (
            <div>
                <h2>Catégories</h2>
                {_.map(categories, function (category, i) {
                    var active   = this.props.search && (this.props.search.categories || []).indexOf(category.slug) > -1;
                    var onChange = active ? this.removeCategory.bind(this, category.slug) : this.addCategory.bind(this, category.slug);

                    return (
                        <label key={category.label} className="checkbox-inline">
                            <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                            <span />
                            {category.label}
                        </label>
                    );
                }, this)}
            </div>
        );
    },
    renderDiscount: function () {
        if (!this.props.withQ) return;

        var withDiscount = (this.props.search && this.props.search.withDiscount) || false;
        var onChange = withDiscount ? this.removeWithDiscount : this.addWithDiscount;

        return (
            <div>
                <h2>Promotions</h2>
                <label className="checkbox-inline">
                    <input type="checkbox" align="baseline" onChange={onChange} checked={withDiscount} />
                    <span />
                    Avec une promotion
                </label>
            </div>
        );
    },
    renderTags: function () {
        var tags = this.props.tags || [];
        if (!this.props.tags || tags.length == 0) return;

        return (
            <div>
                {_.map(this.props.tagCategories, function (category) {
                    var title = <h2>{category.name}</h2>;

                    var tagsInCategory = _.map(tags, function(tag) {
                        if (tag.category.id != category.id) return;
                        var active   = this.props.search && (this.props.search.tags || []).indexOf(tag.name) > -1;
                        var onChange = active ? this.removeTag.bind(this, tag.name) : this.addTag.bind(this, tag.name);
                                                return (
                            <label key={tag.name} className="checkbox-inline">
                                <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                                <span />
                                {tag.name}
                            </label>
                        );
                    }, this);
                    tagsInCategory = _.compact(tagsInCategory);
                    if (_.isEmpty(tagsInCategory)) return;

                    return (
                        <div key={category.name}>
                            {title}
                            {tagsInCategory}
                        </div>);
                }, this)}
            </div>
        );
    },
    renderOpenDays: function () {
        if (this.props.tab != "business") return null;

        var displayDays = ['MON', 'SUN'];
        return (
            <div>
                <h2>Ouverture le</h2>
                {_.map(DateTimeConstants.weekDaysNumber, function(day) {
                    if (_.isEmpty(_.intersection([day], displayDays))) return null;
                    var active   = this.props.search && (this.props.search.days || []).indexOf(day) > -1;
                    var onChange = active ? this.removeDay.bind(this, day) : this.addDay.bind(this, day);
                    return (
                        <label key={DateTimeConstants.weekDayLabelFR(day)} className="checkbox-inline">
                            <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
                            <span />
                            {DateTimeConstants.weekDayLabelFR(day)}
                        </label>
                        );
                    }, this)
                }
            </div>
        );
    },
    handleLocationChange: function(e) {
        this.setState({
            location: e.currentTarget.value
        });
    },
    findMe: function (e) {
        this.setState({
            activeLocation: true
        });
        if (this.props.location) {
            this.setState({
                location: this.props.location
            });
        }
        else {
            this.context.executeAction(PlaceActions.getPlaceByGeolocation);
        }
    },
    addCategory: function (category) {
        this.props.onChange({categories: _.union(this.props.search.categories || [], [category])});
    },
    removeSelection: function(selection) {
        if (this.props.search.tags)
            this.props.onChange({tags: _.without(this.props.search.tags, selection)});
        else if (this.props.search.categories) {

            this.props.onChange({categories: _.without(this.props.search.categories, selection)});
        }
    },
    removeCategory: function (category) {
        this.props.onChange({categories: _.without(this.props.search.categories, category)});
    },
    addTag: function (tag) {
        this.props.onChange({tags: _.union(this.props.search.tags || [], [tag])});
    },
    removeTag: function (tag) {
        this.props.onChange({tags: _.without(this.props.search.tags, tag)});
    },
    addDay: function (day) {
        this.props.onChange({days: _.union(this.props.search.days || [], [day])});
    },
    removeDay: function (day) {
        this.props.onChange({days: _.without(this.props.search.days, day)});
    },
    addWithDiscount: function () {
        this.props.onChange({withDiscount: true});
    },
    removeWithDiscount: function () {
        this.props.onChange({withDiscount: false});
    },
    handleChange: _.debounce(function () {
        this.props.onChange({
            q: this.refs.query.value,
            address: this.refs.address.getFormattedAddress()
        });
    }, 500),
    handleKey: function (e) {
        if(event.keyCode == 13){
            e.preventDefault();
            this.props.onChange({
                q: this.refs.query.value,
                address: this.refs.address.getFormattedAddress()
            });
         }
    },
    handleRadiusChange: function (nextRadius) {
        this.props.onChange({radius: nextRadius});
    },
    handlePriceChange: function (nextPrice) {
        this.props.onChange({price: nextPrice});
    }
});

Filters = connectToStores(Filters, [
    'PlaceStore'
], function (context, props) {
    return _.assign({}, {
        location: context.getStore('PlaceStore').getCurrentPosition()
    }, props);
});

module.exports = Filters;
