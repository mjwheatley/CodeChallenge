import {Constants} from "../../../both/Constants";
import {DutyHour} from "../../../both/models/dutyHour.model";
import {DutyHourCollection} from "../../../both/collections/dutyHour.collection";
var Future = Npm.require('fibers/future');
var bcrypt = Npm.require('bcrypt');

declare var console;
declare var Accounts;

export class MeteorMethods {
    private readonly bcryptSaltRounds = 13;

    public init():void {
        Meteor.methods({
            'initFakeDataForUser': () => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    if (DutyHourCollection.find({userId: user._id}).fetch().length === 0) {
                        const data:DutyHour[] = [
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-17T18:00',
                                end: '2016-12-18T06:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-18T21:00',
                                end: '2016-12-19T12:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-19T18:00',
                                end: '2016-12-20T06:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-22T18:00',
                                end: '2016-12-23T04:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-23T23:00',
                                end: '2016-12-24T07:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-25T06:00',
                                end: '2016-12-26T06:30'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-27T06:00',
                                end: '2016-12-27T14:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-28T12:00',
                                end: '2016-12-28T20:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-29T18:00',
                                end: '2016-12-30T06:30'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-30T12:03',
                                end: '2016-12-31T06:07'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2016-12-31T16:00',
                                end: '2017-01-01T12:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-01T20:00',
                                end: '2017-01-02T22:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-03T06:00',
                                end: '2017-01-03T22:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-04T08:00',
                                end: '2017-01-05T06:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-05T12:00',
                                end: '2017-01-06T06:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-06T14:00',
                                end: '2017-01-07T14:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-07T23:00',
                                end: '2017-01-08T18:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-09T05:00',
                                end: '2017-01-09T17:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-10T04:00',
                                end: '2017-01-10T12:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-11T11:00',
                                end: '2017-01-11T19:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-12T10:00',
                                end: '2017-01-12T23:00'
                            }),
                            new DutyHour({
                                userId: user._id,
                                start: '2017-01-13T09:00',
                                end: '2017-01-13T23:00'
                            })
                        ];
                        data.forEach((obj:DutyHour) => {
                            DutyHourCollection.insert(obj);
                        });
                    }
                }
            },
            '/dutyHour/save': (dutyHour:DutyHour) => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    var future = new Future();

                    var dutyHourId = dutyHour._id;
                    delete dutyHour._id;
                    console.log("saving dutyHour: ", dutyHour);
                    DutyHourCollection.upsert(dutyHourId, dutyHour, (error, result) => {
                        if (error) {
                            console.log("Error saving duty hour: ", error);
                            future.throw(error);
                        } else {
                            if (result.insertedId) {
                                dutyHour._id = result.insertedId;
                            }
                            future.return(dutyHour);
                        }
                    });

                    try {
                        return future.wait();
                    } catch (error) {
                        throw error;
                    }
                }
            },
            '/dutyHour/remove': (dutyHourId:string) => {
                var self = this;
                var user:Meteor.User = self.checkForUser();  // throws errors
                if (user) {
                    var future = new Future();

                    console.log("removing dutyHourId: ", dutyHourId);

                    DutyHourCollection.remove({_id: dutyHourId}, (error) => {
                        if (error) {
                            console.log("Error removing duty hour: ", error);
                            future.throw(error);
                        } else {
                            console.log("Successfully removed duty hour.");
                            future.return(true);
                        }
                    });

                    try {
                        return future.wait();
                    } catch (error) {
                        throw error;
                    }
                }
            }
        });
    }

    private checkForUser():Meteor.User {
        var currentUserId = Meteor.userId();
        var user:Meteor.User;
        if (!currentUserId) {
            throw new Meteor.Error("sign-in", "Please sign in.");
        } else {
            user = Meteor.users.findOne(currentUserId);
            if (!user) {
                throw new Meteor.Error("account-not-found", "Invalid User ID");
            }
        }
        return user;
    }
}