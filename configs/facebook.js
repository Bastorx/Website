'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace: 'FACEBOOK',
    defaults: {
        APP_ID          : '1567052370184577',
        APP_NAMESPACE   : 'hairfie-dev',
        SCOPE           : 'email'
    },
    staging: {
        APP_ID          : '1567052370184577',
        APP_NAMESPACE   : 'hairfie-dev',
        SCOPE           : 'email'
    },
    production: {
        APP_ID          : '726709544031609',
        APP_NAMESPACE   : 'hairfie',
        SCOPE           : 'email'
    }
});
