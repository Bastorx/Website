'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace: 'FACEBOOK',
    defaults: {
        GA_TRACKING_CODE          : 'UA-55125713-3'
    },
    production: {
        GA_TRACKING_CODE          : 'UA-55125713-2'
    }
});
