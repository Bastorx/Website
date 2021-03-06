'use strict';

var Actions = require('../constants/Actions');
var _ = require('lodash');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var SearchUtils = require('../lib/search-utils');
var Promise = require('q');

module.exports = {
    loadTopHairfies: function (context, params) {
        return context.hairfieApi
            .get('/tops/hairfies', { query: { limit: params.limit || 5 } })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_TOP_HAIRFIES, hairfies);
            });
    },
    loadHairfie: function (context, id) {
        return context.hairfieApi
            .get('/hairfies/'+id)
            .then(function (hairfie) {
                context.dispatch(Actions.RECEIVE_HAIRFIE, hairfie);
                return hairfie;
            });
    },
    loadBusinessTopHairfies: function (context, params) {
        var query = {
            'limit': params.limit || 6
        };
        return context.hairfieApi
            .get('/tops/hairfies/'+ params.businessId, { query: query })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_BUSINESS_TOP_HAIRFIES, {
                    businessId: params.businessId,
                    hairfies: hairfies
                });
            });
    },
    loadBusinessHairfies: function (context, params) {
        var params = _.merge({}, { page: 1, pageSize: 12 }, params);
        var query = {
            'filter[where][businessId]': params.businessId,
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (params.page - 1) * params.pageSize,
            'filter[limit]': params.pageSize + (params.add || 0)
        };

        return  context.hairfieApi
            .get('/hairfies', { query: query })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_BUSINESS_HAIRFIES, {
                    businessId: params.businessId,
                    hairfies: hairfies
                });
            });
    },
    loadSimilarHairfies: function (context, params) {
        var params = _.merge({}, { page: 1, pageSize: 12 }, params);

        var query = {
            page: params.page,
            pageSize: params.pageSize + (params.add || 0)
        };
        _.forEach(params.hairfie.tags, function (tag, i) {
            query['tags['+i+']'] = tag.name;
        });

        return  context.hairfieApi
            .get('/hairfies/similar-hairfies', { query: query })
            .then(function (hairfies) {
                var hairfiesId = _.map(hairfies, function(hairfie) {
                    return hairfie.id;
                });
                context.dispatch(Actions.RECEIVE_SIMILAR_HAIRFIES, {
                    hairfieId: params.hairfie.id,
                    hairfies: hairfies,
                    hairfiePage: params.page
                });
            });
    },
    submitSearch: function (context, search) {
        var search = _.merge({ address: 'Paris, France' }, search);
        var params = SearchUtils.searchToRouteParams(search);
        
        return context.executeAction(NavigationActions.navigate, {
            route: 'hairfie_search',
            params: params.path,
            query: params.query,
            preserveScrollPosition: true
        });
    },
    loadSearchResult: function (context, search) {
        var query = { pageSize: 14 };
        query.page = search.page;
        if (!search.sort)
            query.sort='numLikes';
        else 
            query.sort = search.sort;
        _.forEach(search.tags, function (tag, i) {
            query['tags['+i+']'] = tag;
        });

        context.dispatch(Actions.RECEIVE_HAIRFIE_SEARCH_RESULT_START, {});

        return context.hairfieApi
            .get('/hairfies/search', { query: query })
            .then(function (result) {
                context.dispatch(Actions.RECEIVE_HAIRFIE_SEARCH_RESULT, {
                    search: search,
                    result: result
                });
            }, function(){
                context.dispatch(Actions.RECEIVE_HAIRFIE_SEARCH_RESULT_FAILED);
            });
    },
    loadHairdresserHairfies: function (context, params) {
        var query = {
        'filter[where][businessMemberId]': params.id,
        'filter[order]': 'createdAt DESC',
        'filter[limit]': params.pageSize,
        'filter[skip]': (params.page - 1) * params.pageSize
        };
        return context.hairfieApi
            .get('/hairfies', { query: query })
            .then(function (hairfies) {
                Promise.all([
                    context.dispatch(Actions.RECEIVE_HAIRDRESSER_HAIRFIES,
                        {
                            hairdresserId: params.id,
                            hairfies: hairfies,
                            page: params.page
                        })
                ]);
            }, function () {
                return context.executeAction(
                    NotificationActions.notifyError,
                    {
                        title: "Problème lors du chargement des Hairfies",
                        message: "Un problème est survenu"
                    }
                );
            });
    },
    loadUserHairfies: function (context, params) {
        var query = {
            'filter[where][authorId]': params.id,
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (params.page - 1) * params.pageSize,
            'filter[limit]': params.pageSize
        };

        return context.hairfieApi
            .get('/hairfies', { query: query })
            .then(function (hairfies) {
                Promise.all([
                    context.dispatch(Actions.RECEIVE_USER_HAIRFIES,
                        {
                        userId: params.id,
                        hairfies: hairfies,
                        page: params.page
                    })
                ]);
            }, function (error) {
                console.log("error", error);
                return context.executeAction(
                    NotificationActions.notifyError,
                    {
                        title: "Problème lors du chargement des Hairfies",
                        message: "Un problème est survenu"
                    }
                );
            });
    },
    loadUserLikes: function (context, params) {
        var query = {
        'limit': params.pageSize,
        'userId': params.id,
        'order': 'createdAt DESC',
        'skip': (params.page - 1) * params.pageSize
        };
        return context.hairfieApi
            .get('/users/' + params.id + '/liked-hairfies', { query: query })
            .then(function (hairfies) {
                Promise.all([
                    context.dispatch(Actions.RECEIVE_USER_LIKES,
                        {
                        userId: params.id,
                        hairfies: hairfies,
                        page: params.page
                    })
                ]);
            }, function () {
                return context.executeAction(
                    NotificationActions.notifyError,
                    {
                        title: "Erreur",
                        message: "Un problème est survenu, veuillez réessayer ultérieurement."
                    }
                );
            });
    }
};
