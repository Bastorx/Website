'use strict';

var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');

module.exports = {
    submitBooking: function (context, booking) {
        return context.hairfieApi
            .post('/bookings', booking)
            .then(
                function (booking) {
                    return context.executeAction(NavigationActions.navigate, {
                        route: 'booking_confirmation',
                        params: { bookingId: booking.id }
                    });
                },
                function () {
                    return context.executeAction(
                        NotificationActions.notifyFailure,
                        'Un problème est survenu, avez-vous bien rempli les champs obligatoires ?'
                    );
                }
            );
    }
};
