import {DutyHour} from "../models/dutyHour.model";

export const DutyHourCollection = new Mongo.Collection<DutyHour>("duty_hour_collection");

if (Meteor.isServer) {
    DutyHourCollection.allow({
        insert: function (userId, doc) {
            return false;
        },

        update: function (userId, doc, fieldNames, modifier) {
            return false;
        },

        remove: function (userId, doc) {
            return false;
        }
    });

    DutyHourCollection.deny({
        insert: function (userId, doc) {
            return true;
        },

        update: function (userId, doc, fieldNames, modifier) {
            return true;
        },

        remove: function (userId, doc) {
            return true;
        }
    });
}
