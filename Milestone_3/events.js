//     Util = require("util"),
//     helpers = require('../lib/helpers'),
//     googleapis = require('googleapis'),
//     //CALLBACK_URL= process.env.HUBOT_URL + "/google/calendar/webhook",
//     uuid = require('node-uuid'),
//     moment = require("moment");
var _ = require('underscore');
var google = require('googleapis');
var calendar = google.calendar('v3');

var events = {

    /* dummy function. do not delete */
    
    event_quickAdd: function (event) {
        // var range = moment.parseZone(event.start.dateTime || event.start.date)
        //     .twix(moment.parseZone(event.end.dateTime || event.end.date));
        // //return range.format();
    },
    
    /* Call this function if you want to get event details. Should Pass OAuth & event object */
    
    event_get: function (auth, eventID) {
        calendar.events.get({ 
            auth: auth,
            calendarId: "primary",
            eventId: eventID
        }, function(err, event) {
            if (err) {
                console.log('Error getting event: ' + err);
                return null;
            }
            return event;
        });
    },


    
    /* Call this function if you want to Create a new event. Should Pass OAuth & event object */
    
    event_insert: function (auth, event) {
        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
        }, function (err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event.htmlLink);


            console.log('Event ID: %s', event.id);
            //callback(event.id);

        });
        //return event.id;
    },



    /* Call this function if you want to add new set of users to already existing event.
       Should Pass OAuth(String), EventID(String) of the event & emailIDs list (String) (Eg emails_list: "apendya@ncsu.edu ppfirake@ncsu.edu") */
    
    event_patch_add_users: function (auth, eventID, emails_list) {

        //TODO: add logic to extract emailid if only username or name of users are provided.
        // now we are expecting user to input in format "apendya@ncsu.edu ppfirake@ncsu.edu"
        var emails = _.compact(_.map(_.compact(emails_list.split(' '))));

        calendar.events.get({ auth: auth,
            alwaysIncludeEmail: true,
            calendarId: "primary",
            eventId: eventID
        }, function(err, event) {
            if (err) {
                console.log('Error getting event: ' + err);
                return;
            }
            var emailsObj = _.map(emails, function (a) {
                return {email: a+"@ncsu.edu"};
            });

            var current_emails = _.map(event.attendees, function (a) {
                return {email: a.email};
            });
            var emailUnion = _.union(emailsObj, current_emails);

            calendar.events.patch({
                auth: auth,
                calendarId: "primary",
                eventId: event.id,
                resource: {attendees: emailUnion}
            }, function (err, event) {
                if (err) {
                    console.log('Error inviting additional users: ' + err);
                    return;
                }
                console.log("Users invitation success for Event with ID: %s", event.id);
            });
        });
    },

    
    /* Call this function if you want to remove a set of users to already existing event.
       Should Pass OAuth(String), EventID(String) of the event & emailIDs list (String) (Eg emails_list: "apendya@ncsu.edu ppfirake@ncsu.edu") */
    
    event_patch_remove_users: function (auth, eventID, emails_list) {
        //TODO: add logic to extract emailid if only username or name of users are provided.
        // now we are expecting user to input in format "apendya@ncsu.edu ppfirake@ncsu.edu"
        var emails = _.compact(_.map(_.compact(emails_list.split(' '))));
        calendar.events.get({ auth: auth,
            alwaysIncludeEmail: true,
            calendarId: "primary",
            eventId: eventID
        }, function(err, event) {
            if (err) {
                console.log('Error getting event: ' + err);
                return;
            }
            var emailsObj = _.map(emails, function (a) {
                return {email: a};
            });

            var current_emails = _.map(event.attendees, function (a) {
                return {email: a.email};
            });

            var emailDisjunction = [];
            for (var i = 0; i < current_emails.length; i++)
            {
                var isPresent = _.find(emailsObj, function(d){
                                 return d.email === current_emails[i].email;
                        });
                if(!isPresent)
                {
                    emailDisjunction.push(current_emails[i]);
                }
            }

            calendar.events.patch({
                auth: auth,
                calendarId: "primary",
                eventId: event.id,
                resource: {attendees: emailDisjunction}
            }, function (err, event) {
                if (err) {
                    console.log('Error inviting additional users: ' + err);
                    return;
                }
                console.log("Users invitation success for Event with ID: %s", event.id);
            });
        });
    },


    /* Call this function if you want to delete an already existing event.
       Should Pass OAuth(String), EventID(String) of the event*/
    
    event_delete: function (auth, eventID) {
        var dummy = eventID;
       calendar.events.delete({
           auth: auth,
           calendarId: 'primary',
           eventId: eventID,
       }, function (err, eventID) {
           if (err) {
               console.log('There was an error deleting the Event with ID: ' + err);
               return;
           }
           console.log('Event deleted  EventID: ' + dummy);
       });
   }
}

module.exports = events;
