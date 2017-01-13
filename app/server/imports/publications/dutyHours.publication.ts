import {DutyHourCollection} from "../../../both/collections/dutyHour.collection";

Meteor.publish('DutyHourCollection', function () {
    return DutyHourCollection.find({});
});

Meteor.publish('MyDutyHours', function () {
    return DutyHourCollection.find({userId: this.userId});
});